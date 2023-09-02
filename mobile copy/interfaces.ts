export interface IProduct {
  image: string;
  price: number;
  quantity: number;
  disponibility: boolean;
  description: string;
  id: number;
  name: string;
  category: ICategory;
}
export interface IReservation {
  id: number;
  product: IProduct;
  cart: ICart;
  order?: IOrder;
  startDate: Date;
  endDate: Date;
  quantity: number;
  price: number;
  taxes: number;
}
export interface IOrder {
  id: number;
  user: IUser;
  billingfirstname: string;
  billingLastname: string;
  billingAdress: string;
  deliveryfirstname: string;
  deliveryLastname: string;
  deliveryAdress: string;
  totalPrice: number;
  statusDelivery: string;
  date: Date;
  reservations: IReservation[];
}

export interface ICategoryProps {
  name: string;
}

export interface ICategory {
  id: number;
  name: string;
  image: string;
}

export interface ICart {
  id: number;
  user?: IUser;
  billingfirstname: string;
  billingLastname: string;
  billingAdress: string;
  deliveryfirstname: string;
  deliveryLastname: string;
  deliveryAdress: string;
  lastTimeModified?: Date;
  reservations?: IReservation[];
}

export interface IUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  deliveryAdress: string;
  createdAt: Date;
  cart: ICart;
  orders: IOrder[];
}

export interface IConnection {
  onTokenChange: Function;
  navigation: any;
  setView: Function;
}

export interface IAddressOrder {
  delivery: IAddress;
  billing?: IAddress;
}

export interface IPurchaseProces {
  cart: boolean;
  address: boolean;
  payment: boolean;
  confirmation: boolean;
}

export interface IAddress {
  firstname: string;
  lastname: string;
  address: string;
}

export interface IAddressComponent {
  address: IAddressOrder;
  setAddress: Function;
}

export interface INotificationPush {
  type: "newProduct";
  notificationId: number;
}
