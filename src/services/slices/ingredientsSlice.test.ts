import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

// Моковые данные для тестов
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.png',
    image_large: 'image_large.png',
    image_mobile: 'image_mobile.png'
  },
  {
    _id: '2',
    name: 'Соус',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'image.png',
    image_large: 'image_large.png',
    image_mobile: 'image_mobile.png'
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('должен устанавливать loading: true при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен сохранять ингредиенты и устанавливать loading: false при fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBe(null);
    });

    it('должен сохранять ошибку и устанавливать loading: false при rejected', () => {
      const errorMessage = 'Failed to fetch ingredients';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });

    it('должен использовать дефолтное сообщение об ошибке если message не указан', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.error).toBe('Failed to fetch ingredients');
    });

    it('должен корректно обрабатывать последовательные запросы', () => {
      // Первый запрос - pending
      let state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);

      // Первый запрос - fulfilled
      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);

      // Второй запрос - pending
      state = ingredientsReducer(state, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });
});
