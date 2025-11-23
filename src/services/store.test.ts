import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  feed: feedReducer,
  user: userReducer
});

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при вызове с undefined и UNKNOWN_ACTION', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        orderRequest: false,
        error: null,
        orderName: ''
      },
      feed: expect.any(Object),
      user: expect.any(Object)
    });
  });

  it('должен правильно инициализировать store', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: burgerConstructorReducer,
        order: orderReducer,
        feed: feedReducer,
        user: userReducer
      }
    });

    const state = store.getState();

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        orderRequest: false,
        error: null,
        orderName: ''
      },
      feed: expect.any(Object),
      user: expect.any(Object)
    });
  });

  it('должен иметь все необходимые редьюсеры', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: burgerConstructorReducer,
        order: orderReducer,
        feed: feedReducer,
        user: userReducer
      }
    });

    const state = store.getState();

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
  });
});
