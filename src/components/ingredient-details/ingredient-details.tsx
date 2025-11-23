import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const loading = useSelector((state) => state.ingredients.loading);
  const ingredientData = ingredients.find((item) => item._id === id);

  // Показываем прелоадер во время загрузки ингредиентов
  if (loading) {
    return <Preloader />;
  }

  // Показываем прелоадер если ингредиент не найден
  // (в будущем можно заменить на страницу 404 или сообщение об ошибке)
  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
