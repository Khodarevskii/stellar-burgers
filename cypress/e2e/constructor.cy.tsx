describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехватываем запрос на получение данных пользователя
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Устанавливаем моковые токены для авторизации
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
    cy.setCookie('accessToken', 'mock-access-token');

    // Посещаем страницу конструктора
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем localStorage и cookies после каждого теста
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Добавление ингредиентов', () => {
    it('должно добавлять булку в конструктор', () => {
      // Находим первую булку и добавляем её
      cy.contains('h3', 'Булки').parent().find('ul').first().within(() => {
        cy.get('button').contains('Добавить').first().click();
      });

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должно заменять булку при добавлении новой', () => {
      // Добавляем вторую булку
      cy.contains('h3', 'Булки').parent().find('ul').first().within(() => {
       cy.get('li').eq(1).find('button').contains('Добавить').click();

      });

 

      // Проверяем, что вторая булка добавилась сверху и снизу

      cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');

      cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');

 

      // Добавляем первую булку

      cy.contains('h3', 'Булки').parent().find('ul').first().within(() => {

        cy.get('li').eq(0).find('button').contains('Добавить').click();
      });


      // Добавляем первую булку
      cy.contains('h3', 'Булки').parent().find('ul').first().within(() => {
      cy.get('button').contains('Добавить').first().click();
      });

      // Проверяем, что первая булка добавилась сверху и снизу, заменив вторую
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должно добавлять начинку в конструктор', () => {
      // Добавляем начинку
      cy.contains('h3', 'Начинки').parent().find('ul').eq(1).within(() => {
        cy.get('button').contains('Добавить').first().click();
      });

      // Проверяем, что начинка появилась в конструкторе
      cy.contains('.constructor-element__text', 'Филе Люминесцентного тетраодонтимформа').should('exist');
    });

    it('должно добавлять соус в конструктор', () => {
      // Добавляем соус
      cy.contains('h3', 'Соусы').parent().find('ul').eq(2).within(() => {
        cy.get('button').contains('Добавить').first().click();
      });

      // Проверяем, что соус появился в конструкторе
      cy.contains('.constructor-element__text','Соус Spicy-X').should('exist');
    });

    it('должно добавлять несколько начинок', () => {
      // Добавляем несколько начинок
      cy.contains('h3', 'Начинки').parent().find('ul').eq(1).within(() => {
        cy.get('li').eq(0).find('button').contains('Добавить').click();
        cy.get('li').eq(1).find('button').contains('Добавить').click();
      });

      // Проверяем, что обе начинки добавлены
      cy.contains('.constructor-element__text','Филе Люминесцентного тетраодонтимформа').should('exist');
      cy.contains('.constructor-element__text','Мясо бессмертных моллюсков Protostomia').should('exist');
    });
  });

  describe('Модальные окна ингредиентов', () => {
    it('должно открывать модальное окно при клике на ингредиент', () => {
      // Кликаем на ингредиент (не на кнопку "Добавить")
      // Ищем ингредиент в списке ингредиентов, а не в конструкторе
      cy.contains('h3', 'Булки').parent().find('ul').first();
      cy.get('li').eq(0).find('a').first().click();

      // Проверяем, что модальное окно открылось и полностью загружено
      
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('должно закрывать модальное окно по клику на крестик', () => {
      // Открываем модальное окно
      cy.contains('h3', 'Булки').parent().find('ul').first()
      cy.get('li').eq(0).find('a').first().click();

      // Закрываем модальное окно по клику на крестик
      cy.get('#modals').find('button').click();

      // Проверяем, что модальное окно закрылось
      cy.get('#modals').should('not.visible');
    });

    it('должно закрывать модальное окно по клику на оверлей', () => {
      // Открываем модальное окно
      cy.contains('h3', 'Булки').parent().find('ul').first()
      cy.get('li').eq(0).find('a').first().click();

      // Проверяем, что модальное окно открыто и полностью загружено
      

      // Закрываем модальное окно по клику на оверлей
      cy.get('#modals').find('div').eq(1).click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get('#modals').should('not.visible');
    });

    it('должно отображать детальную информацию об ингредиенте в модальном окне', () => {
      // Открываем модальное окно с деталями ингредиента
      cy.contains('h3', 'Булки').parent().find('ul').first()
      cy.get('li').eq(0).find('a').first().click();

      // Проверяем, что модальное окно открыто и полностью загружено
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Калории').should('be.visible');
      cy.contains('Белки').should('be.visible');
      cy.contains('Жиры').should('be.visible');
      cy.contains('Углеводы').should('be.visible');

      // закрываем попап
      cy.get('#modals').find('div').eq(1).click({ force: true });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Перехватываем запрос на создание заказа
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
    });

    it('должно успешно создавать заказ', () => {
      // Собираем бургер
      // Добавляем булку
      cy.contains('h3', 'Булки').parent().find('ul').first().within(() => {
      cy.get('button').contains('Добавить').first().click();
      });

      // Добавляем начинку
      cy.contains('h3', 'Начинки').parent().find('ul').first().within(() => {
      cy.get('button').contains('Добавить').first().click();
      });

      // Добавляем соус
      cy.contains('h3', 'Соусы').parent().find('ul').first().within(() => {
      cy.get('button').contains('Добавить').first().click();
      });

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('button', 'Оформить заказ').click();

      // Ждём выполнения запроса
      cy.wait('@createOrder');

      // Проверяем, что модальное окно с номером заказа открылось и полностью загружено
      

      // Проверяем, что номер заказа отображается правильно
      cy.contains('12345').should('be.visible');
    });

    it('должно закрывать модальное окно заказа и очищать конструктор', () => {
      // Собираем бургер
      cy.contains('h3', 'Булки').parent().find('ul').first().within(() => {
      cy.get('button').contains('Добавить').first().click();
      });

      cy.contains('h3', 'Начинки').parent().find('ul').first().within(() => {
      cy.get('button').contains('Добавить').first().click();
      });

      // Оформляем заказ
      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открыто и полностью загружено

      // Закрываем модальное окно
      cy.get('#modals').within(() => {
      cy.get('button').click();
      });

      // Проверяем, что модальное окно закрылось
      cy.get('#modals').should('not.visible');

      // Проверяем, что конструктор пуст
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });

    it('должно отображать корректную общую стоимость', () => {
      // Добавляем булку (цена 1255, удваивается так как булка добавляется дважды)
      cy.contains('h3', 'Булки').parent().find('ul').first().within(() => {
      cy.get('button').contains('Добавить').first().click();
      });

      // Добавляем начинку (цена 988)
      cy.contains('h3', 'Начинки').parent().find('ul').eq(1).within(() => {
      cy.get('button').contains('Добавить').first().click();
      });

      // Проверяем общую стоимость: 1255 * 2 + 988 = 3498
      cy.get('section').contains('3498').should('be.visible');
    });
  });
});
