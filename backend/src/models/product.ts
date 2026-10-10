import mongoose from 'mongoose';

export interface IProduct {
  title: string;
  image: string;
  category: string;
  description?: string;
  price?: number | null;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
    unique: true,
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
  },
  image: {
    type: String,
    required: [true, 'Поле "image" обязательно'],
  },
  category: {
    type: String,
    required: [true, 'Поле "category" обязательно'],
  },
  description: {
    type: String,
    required: false,
    minlength: [10, 'Описание должно быть не короче 10 символов'],
    maxlength: [200, 'Описание не должно превышать 200 символов'],
  },
  price: {
    type: Number,
    required: false,
    default: null,
    min: [1, 'Цена должна быть не менее 1'],
  },
});

export default mongoose.model<IProduct>('product', productSchema);
