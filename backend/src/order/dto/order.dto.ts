export class CreateTicketDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class CreatedTicketDto extends CreateTicketDto {
  id: string;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: CreateTicketDto[];
}

export class OrderResponseDto {
  total: number;
  items: CreatedTicketDto[];
}
