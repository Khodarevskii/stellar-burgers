import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

// Моковые данные для тестов
const mockBun: TIngredient = {
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
};

const mockIngredient: TIngredient = {
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
};

const mockMain: TIngredient = {
  _id: '3',
  name: 'Мясо',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'image.png',
  image_large: 'image_large.png',
  image_mobile: 'image_mobile.png'
};

describe('burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен вернуть начальное состояние', () => {
    expect(burgerConstructorReducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  describe('addIngredient', () => {
    it('должен добавлять булку', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );

      expect(state.bun).toBeDefined();
      expect(state.bun?.name).toBe('Булка');
      expect(state.bun?.type).toBe('bun');
      expect(state.bun).toHaveProperty('id');
    });

    it('должен заменять булку при добавлении новой', () => {
      const stateWithBun = {
        bun: { ...mockBun, id: 'old-id' } as TConstructorIngredient,
        ingredients: []
      };

      const newBun: TIngredient = {
        ...mockBun,
        _id: '999',
        name: 'Новая булка'
      };

      const state = burgerConstructorReducer(
        stateWithBun,
        addIngredient(newBun)
      );

      expect(state.bun?.name).toBe('Новая булка');
      expect(state.bun?._id).toBe('999');
    });

    it('должен добавлять начинку в массив', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Соус');
      expect(state.ingredients[0]).toHaveProperty('id');
    });

    it('должен добавлять несколько начинок', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(mockMain));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].name).toBe('Соус');
      expect(state.ingredients[1].name).toBe('Мясо');
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'test-id-1' } as TConstructorIngredient,
          { ...mockMain, id: 'test-id-2' } as TConstructorIngredient
        ]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        removeIngredient('test-id-1')
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('test-id-2');
    });

    it('не должен изменять состояние при удалении несуществующего id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'test-id-1' } as TConstructorIngredient
        ]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        removeIngredient('non-existent-id')
      );

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    it('должен перемещать ингредиент вниз', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          {
            ...mockIngredient,
            id: 'id-1',
            name: 'Соус'
          } as TConstructorIngredient,
          { ...mockMain, id: 'id-2', name: 'Мясо' } as TConstructorIngredient,
          {
            ...mockIngredient,
            id: 'id-3',
            name: 'Сыр'
          } as TConstructorIngredient
        ]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        moveIngredient({ from: 0, to: 1 })
      );

      expect(state.ingredients[0].name).toBe('Мясо');
      expect(state.ingredients[1].name).toBe('Соус');
      expect(state.ingredients[2].name).toBe('Сыр');
    });

    it('должен перемещать ингредиент вверх', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          {
            ...mockIngredient,
            id: 'id-1',
            name: 'Соус'
          } as TConstructorIngredient,
          { ...mockMain, id: 'id-2', name: 'Мясо' } as TConstructorIngredient,
          {
            ...mockIngredient,
            id: 'id-3',
            name: 'Сыр'
          } as TConstructorIngredient
        ]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        moveIngredient({ from: 2, to: 0 })
      );

      expect(state.ingredients[0].name).toBe('Сыр');
      expect(state.ingredients[1].name).toBe('Соус');
      expect(state.ingredients[2].name).toBe('Мясо');
    });

    it('должен корректно перемещать ингредиент на одну позицию', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          {
            ...mockIngredient,
            id: 'id-1',
            name: 'Первый'
          } as TConstructorIngredient,
          { ...mockMain, id: 'id-2', name: 'Второй' } as TConstructorIngredient
        ]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        moveIngredient({ from: 0, to: 1 })
      );

      expect(state.ingredients[0].name).toBe('Второй');
      expect(state.ingredients[1].name).toBe('Первый');
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать конструктор', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'test-id' } as TConstructorIngredient,
        ingredients: [
          { ...mockIngredient, id: 'test-id-1' } as TConstructorIngredient,
          { ...mockMain, id: 'test-id-2' } as TConstructorIngredient
        ]
      };

      const state = burgerConstructorReducer(stateWithData, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    it('должен корректно очищать уже пустой конструктор', () => {
      const state = burgerConstructorReducer(initialState, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
  });
});
