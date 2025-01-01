import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { TransactionsService } from 'src/payment-gateway/transactions/transactions.service';
import { PaymentProvider } from '../payment-provider.interface';
import { PaymentRequest } from 'src/payment-gateway/dtos/payment-request';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionType } from 'src/payment-gateway/enums/transaction-type';
import { StkRequest } from './dto/stk-request';
import { StkResponse } from './dto/stk-response';

@Injectable()
export class MpesaService implements PaymentProvider {
  private readonly logger = new Logger(MpesaService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly transactionService: TransactionsService,
  ) {}

  async authenticate(): Promise<string> {
    const {
      MPESA_AUTHENTICATION_URL,
      MPESA_CONSUMER_KEY,
      MPESA_CONSUMER_SECRET,
    } = process.env;

    if (
      !MPESA_AUTHENTICATION_URL ||
      !MPESA_CONSUMER_KEY ||
      !MPESA_CONSUMER_SECRET
    ) {
      this.logger.error('MPESA environment variables are not set');
      throw new Error('MPESA authentication configuration is invalid');
    }

    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(MPESA_AUTHENTICATION_URL, {
          auth: {
            username: MPESA_CONSUMER_KEY,
            password: MPESA_CONSUMER_SECRET,
          },
          params: {
            grant_type: 'client_credentials',
          },
        })
        .pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            throw new Error('MPESA Authentication Failed');
          }),
        ),
    );

    this.logger.log(
      `MPESA Authentication successful, token acquired. Expires in: ${data.expires_in} seconds`,
    );

    this.logger.log('ACESS TOKEN: ' + data.access_token);

    return data.access_token;
  }

  async initiatePayment(paymentRequest: PaymentRequest): Promise<Transaction> {
    if (paymentRequest.mobile.transactionType == TransactionType.STK) {
      return await this.initiateStkPayment(paymentRequest);
    }
  }

  private async initiateStkPayment(
    paymentRequest: PaymentRequest,
  ): Promise<Transaction> {
    const stkRequest = this.buildStkRequest(
      paymentRequest.amount,
      paymentRequest.orderId,
      paymentRequest.mobile.phoneNumber.replace('+', ''),
    );

    this.logger.log(JSON.stringify(stkRequest));
    const basicToken = await this.authenticate();

    const { data } = await firstValueFrom(
      this.httpService
        .post<StkResponse>(process.env.MPESA_STKPUSH, stkRequest, {
          headers: { Authorization: `Bearer ${basicToken}` },
        })
        .pipe(
          catchError((err: AxiosError) => {
            this.logger.error(err.message);
            this.logger.error('FAILED INITIATING STK PAYMENT');
            this.logger.error(err);
            console.error(
              'Error:',
              err.response ? err.response.data : err.message,
            );
            throw new InternalServerErrorException(err.message);
          }),
        ),
    );

    this.logger.log('STKResponse: {}', data);
    return this.buildAndSaveTransaction(paymentRequest, data);
  }

  private buildStkRequest(
    amount: number,
    paymentRef: string,
    accountNo: string,
  ) {
    const shortCode = process.env.MPESA_STK_SHORTCODE;
    const timestamp = this.getFormattedDate();
    const dataToEncode = `${shortCode}${process.env.MPESA_PASSKEY}${timestamp}`;
    const pass = Buffer.from(dataToEncode).toString('base64');

    const stkRequest = new StkRequest();
    stkRequest.Amount = amount.toString();
    stkRequest.BusinessShortCode = shortCode;
    stkRequest.Password = pass;
    stkRequest.TransactionType = 'CustomerPayBillOnline';
    stkRequest.AccountReference = paymentRef;
    stkRequest.PartyA = accountNo;
    stkRequest.PartyB = shortCode;
    stkRequest.PhoneNumber = accountNo;
    stkRequest.CallBackURL = process.env.MPESA_CALLBACK;
    stkRequest.Timestamp = timestamp;
    stkRequest.TransactionDesc = 'Stylemart Goods Payment';
    return stkRequest;
  }

  private async buildAndSaveTransaction(
    paymentRequest: PaymentRequest,
    data: StkResponse,
  ) {
    const transaction = new Transaction();
    transaction.amount = paymentRequest.amount;
    transaction.orderId = paymentRequest.orderId;
    transaction.provider = paymentRequest.provider;
    transaction.description = `${paymentRequest.amount} paid by [USER] for transaction ${paymentRequest.orderId}`;
    transaction.requestCode = data.MerchantRequestID;
    return await this.transactionService.createTransaction(transaction);
  }

  getFormattedDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().padStart(4, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}