/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Ожидает загрузки и видимости модального окна
       * @param timeout - таймаут ожидания (по умолчанию 10000мс)
       */
      waitForModal(timeout?: number): Chainable<JQuery<HTMLElement>>;
    }
  }
}

/**
 * Кастомная команда для надежного ожидания модального окна
 * Проверяет не только существование, но и видимость элемента
 */
Cypress.Commands.add('waitForModal', (timeout = 10000) => {
  return cy
    .get('[class*="modal"]', { timeout })
    .should('be.visible')
    .and('have.length.at.least', 1);
});

export {};
