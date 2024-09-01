import axios from 'axios';
import getCurrencyByLocale from './App.vue';

jest.mock('axios');

describe('getCurrencyByLocale', () => {

  it('Должен возвращать валюту из ответа API', async () => {
    // Имитация ответа API с валютой EUR
    const response = { data: { currency: 'EUR' } };
    axios.post.mockResolvedValue(response);

    const result = await getCurrencyByLocale('en-US');    

    expect(result).toBe('EUR');
  });


  it('Должен возвращать USD, если ответ API пустой для не-русской локали', async () => {
    // Имитация пустого ответа API
    const response = { data: {} };
    axios.post.mockResolvedValue(response);

    const result = await getCurrencyByLocale('en-US');    

    expect(result).toBe('USD');
  });

  // Тест: 
  it('Должен возвращать RUB, если ответ API пустой для русской локали', async () => {
    // Имитация пустого ответа API
    const response = { data: {} };
    axios.post.mockResolvedValue(response);

    const result = await getCurrencyByLocale('ru-RU');    

    expect(result).toBe('RUB');
  });

  // Тест: 
  it('Должен возвращать USD, если вызов API завершился неудачей для не-русской локали', async () => {
    // Имитация ошибки вызова API
    axios.post.mockRejectedValue(new Error('Network Error'));

    // Вызов функции с локалью 'en-US'
    const result = await getCurrencyByLocale('en-US');
    
    // Ожидание, что результат будет 'USD'
    expect(result).toBe('USD');
  });

  // Тест:
  it(' Должен возвращать RUB, если вызов API завершился неудачей для русской локали', async () => {
    // Имитация ошибки вызова API
    axios.post.mockRejectedValue(new Error('Network Error'));

    // Вызов функции с локалью 'ru-RU'
    const result = await getCurrencyByLocale('ru-RU');
    
    // Ожидание, что результат будет 'RUB'
    expect(result).toBe('RUB');
  });
});