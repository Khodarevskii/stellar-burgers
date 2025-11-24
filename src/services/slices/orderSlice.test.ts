import orderReducer, { createOrder, clearOrder, initialState } from './orderSlice';
import { TOrder } from '../../utils/types';

// Моковые данные для тестов
const mockOrder: TOrder = {
  _id: '123',
  status: 'done',
  name: 'Space бургер',
  createdAt: '2023-09-06T12:00:00.000Z',
  updatedAt: '2023-09-06T12:00:00.000Z',
  number: 12345,
  ingredients: ['1', '2', '3']
};

const mockOrderResponse = {
  order: mockOrder,
  name: 'Space бургер'
};

describe('orderSlice', () => {
  it('должен вернуть начальное состояние', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('createOrder', () => {
    it('должен устанавливать orderRequest: true при pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен сохранять заказ и устанавливать orderRequest: false при fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrderResponse
      };
      const state = orderReducer(
        { ...initialState, orderRequest: true },
        action
      );

      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.orderName).toBe('Space бургер');
      expect(state.error).toBe(null);
    });

    it('должен сохранять ошибку и устанавливать orderRequest: false при rejected', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(
        { ...initialState, orderRequest: true },
        action
      );

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.order).toBe(null);
    });

    it('должен использовать дефолтное сообщение об ошибке если message не указан', () => {
      const action = {
        type: createOrder.rejected.type,
        error: {}
      };
      const state = orderReducer(
        { ...initialState, orderRequest: true },
        action
      );

      expect(state.error).toBe('Failed to create order');
    });
  });

  describe('clearOrder', () => {
    it('должен очищать заказ', () => {
      const stateWithOrder = {
        order: mockOrder,
        orderRequest: false,
        error: null,
        orderName: 'Space бургер'
      };

      const state = orderReducer(stateWithOrder, clearOrder());

      expect(state.order).toBe(null);
      expect(state.orderName).toBe('');
      expect(state.error).toBe(null);
      expect(state.orderRequest).toBe(false);
    });

    it('должен корректно очищать уже пустое состояние', () => {
      const state = orderReducer(initialState, clearOrder());

      expect(state.order).toBe(null);
      expect(state.orderName).toBe('');
      expect(state.error).toBe(null);
    });

    it('должен очищать ошибку вместе с заказом', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
        order: mockOrder,
        orderName: 'Test'
      };

      const state = orderReducer(stateWithError, clearOrder());

      expect(state.order).toBe(null);
      expect(state.orderName).toBe('');
      expect(state.error).toBe(null);
    });
  });

  describe('integration scenarios', () => {
    it('должен корректно обрабатывать последовательность: создание -> очистка', () => {
      // Создание заказа - pending
      let state = orderReducer(initialState, {
        type: createOrder.pending.type
      });
      expect(state.orderRequest).toBe(true);

      // Создание заказа - fulfilled
      state = orderReducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrderResponse
      });
      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);

      // Очистка заказа
      state = orderReducer(state, clearOrder());
      expect(state.order).toBe(null);
      expect(state.orderName).toBe('');
    });

    it('должен корректно обрабатывать повторное создание заказа', () => {
      // Первый заказ
      let state = orderReducer(initialState, {
        type: createOrder.fulfilled.type,
        payload: mockOrderResponse
      });

      // Очистка
      state = orderReducer(state, clearOrder());

      // Второй заказ - pending
      state = orderReducer(state, {
        type: createOrder.pending.type
      });
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBe(null);
    });
  });
});
