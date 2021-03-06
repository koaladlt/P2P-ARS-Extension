import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  VStack,
  Button,
  Text,
  HStack,
  Box,
  Checkbox,
  Select,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

import Body from './Body';
import { getDollars, getPrices } from '../api/getPrices';

const App = () => {
  const [prices, setPrices] = useState({ prices: [], errorMessage: '' });
  const [loading, setLoading] = useState(false);
  const [loadingDollars, setLoadingDollars] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [dollars, setDollars] = useState({ blue: '', mep: '', ccl: '' });
  const [condition, setCondition] = useState<string>('');
  const [verifiedUser, setVerifiedUser] = useState(false);
  const [change, setChange] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const controller = new AbortController();

  useEffect(() => {
    if (selectedCurrency.length > 0) {
      getPrice(selectedCurrency, condition, verifiedUser, paymentMethod);
    } else {
      console.log('entro en el else');
      chrome.storage.sync.get(
        ['currency', 'condition', 'verifiedUser', 'paymentMethod'],
        ({ currency, condition, verifiedUser, paymentMethod }) => {
          if (currency) {
            console.log(paymentMethod);
            setCondition(condition);
            setVerifiedUser(verifiedUser);
            setPaymentMethod(paymentMethod);
            getPrice(currency, condition, verifiedUser, paymentMethod);
          }
        }
      );
    }

    return () => {
      controller.abort();
    };
  }, [change]);

  useEffect(() => {
    getDollarsPrices();
  }, []);

  const handleConditionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCondition(e.target.value);
    setChange(!change);
  };

  const handlePaymentMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
    setChange(!change);
  };

  const handleVerified = () => {
    setVerifiedUser(!verifiedUser);
    setChange(!change);
  };

  const getDollarsPrices = async () => {
    try {
      setLoadingDollars(true);
      const d = await getDollars();
      setDollars({ blue: d.blue, ccl: d.ccl, mep: d.mep });
      setLoadingDollars(false);
    } catch (error) {
      console.log(error);
      setLoadingDollars(false);
    }
  };

  const getPrice = async (
    currency: string,
    condition: string,
    verifiedUser: boolean,
    paymentMethod: string
  ) => {
    try {
      await chrome.storage.sync.set({
        currency,
        condition,
        verifiedUser,
        paymentMethod,
      });
      setError(false);
      setPrices({ prices: [], errorMessage: '' });
      setSelectedCurrency(currency);
      setLoading(true);

      const data = await getPrices(
        paymentMethod,
        condition,
        verifiedUser,
        currency,
        controller
      );
      setUrl(data.url);
      setPrices({
        prices: data.prices,
        errorMessage:
          data.prices.length > 0 ? '' : 'No se ha encontrado ninguna oferta',
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <VStack backgroundColor='gray.800'>
      <Box width='100%' backgroundColor='gray.700' py={2}>
        <HStack
          justifyContent='flex-end'
          mr={2}
          mb={2}
          onClick={() => window.open('http://github.com/koaladlt')}
          cursor='pointer'
        >
          <FaGithub color='white' size={15} />
          <Text color={'whiteAlpha.800'}>@koaladlt</Text>
        </HStack>
        <Text
          color={'whiteAlpha.800'}
          fontSize='large'
          fontWeight={'extrabold'}
        >
          Cotizaciones P2P en Binance
        </Text>

        <HStack mt={4} justifyContent='space-evenly'>
          {loadingDollars ? (
            <>
              <Skeleton
                startColor='whiteAlpha.600'
                endColor='whiteAlpha.400'
                height={'20px'}
                width='50px'
              />
              <Skeleton
                startColor='whiteAlpha.600'
                endColor='whiteAlpha.400'
                height={'20px'}
                width='50px'
              />
              <Skeleton
                startColor='whiteAlpha.600'
                endColor='whiteAlpha.400'
                height={'20px'}
                width='50px'
              />
            </>
          ) : (
            <>
              <Text color='whiteAlpha.800' fontWeight='bold'>
                Blue: ${dollars.blue}
              </Text>
              <Text color='whiteAlpha.800' fontWeight='bold'>
                Mep: ${dollars.mep}
              </Text>
              <Text color='whiteAlpha.800' fontWeight='bold'>
                CCL: ${dollars.ccl}
              </Text>
            </>
          )}
        </HStack>
      </Box>
      <Box width='100%' backgroundColor='gray.800' my={2}>
        <HStack justifyContent='space-evenly'>
          <Button
            color='#F0B90B'
            size='sm'
            onClick={() =>
              getPrice('USDT', condition, verifiedUser, paymentMethod)
            }
            fontFamily='Nunito'
            variant={'link'}
            textDecoration={
              selectedCurrency === 'USDT' ? 'underline' : undefined
            }
            textUnderlineOffset={4}
            disabled={loading}
          >
            USDT
          </Button>
          <Button
            color='#F0B90B'
            size='sm'
            variant='link'
            textDecoration={
              selectedCurrency === 'DAI' ? 'underline' : undefined
            }
            textUnderlineOffset={4}
            onClick={() => {
              getPrice('DAI', condition, verifiedUser, paymentMethod);
            }}
            disabled={loading}
          >
            DAI
          </Button>
          <Button
            color='#F0B90B'
            size='sm'
            variant='link'
            textDecoration={
              selectedCurrency === 'BUSD' ? 'underline' : undefined
            }
            textUnderlineOffset={4}
            onClick={() => {
              getPrice('BUSD', condition, verifiedUser, paymentMethod);
            }}
            disabled={loading}
          >
            BUSD
          </Button>
          <Button
            color='#F0B90B'
            size='sm'
            variant='link'
            textDecoration={
              selectedCurrency === 'BTC' ? 'underline' : undefined
            }
            textUnderlineOffset={4}
            onClick={() => {
              getPrice('BTC', condition, verifiedUser, paymentMethod);
            }}
            disabled={loading}
          >
            BTC
          </Button>
          <Button
            color='#F0B90B'
            size='sm'
            variant='link'
            textDecoration={
              selectedCurrency === 'ETH' ? 'underline' : undefined
            }
            textUnderlineOffset={4}
            onClick={() => {
              getPrice('ETH', condition, verifiedUser, paymentMethod);
            }}
            disabled={loading}
          >
            ETH
          </Button>
        </HStack>

        <HStack my={4} justifyContent={'space-around'}>
          <Select
            width='35%'
            color={'whiteAlpha.800'}
            fontSize='xs'
            size='xs'
            textAlign='center'
            borderRadius={5}
            fontWeight='bold'
            disabled={loading}
            value={paymentMethod}
            onChange={(e) => handlePaymentMethodChange(e)}
          >
            <option value='all-payments'>Todos los pagos</option>
            <option value='MercadoPagoNew'>MercadoPago</option>
            <option value='BancoBrubankNew'>Brubank</option>
            <option value='UalaNew'>Ual??</option>
            <option value='BankArgentina'>Trans. bancaria</option>
            <option value='CashInPerson'>Efectivo</option>
          </Select>

          <Select
            width='35%'
            color={'whiteAlpha.800'}
            fontSize='xs'
            size='xs'
            borderRadius={5}
            fontWeight='bold'
            textAlign='center'
            onChange={(e) => handleConditionChange(e)}
            disabled={loading}
            value={condition}
          >
            <option value='buy'>Comprar</option>
            <option value='sell'>Vender</option>
          </Select>
        </HStack>
        <Stack my={4} display='flex' alignItems='center'>
          <Checkbox
            isChecked={verifiedUser}
            textColor={'whiteAlpha.800'}
            onChange={() => handleVerified()}
            disabled={loading}
            _hover={{ borderColor: '#E5C232' }}
            colorScheme='yellow'
          >
            <Text fontSize={'xs'} fontWeight='bold'>
              Solo usuarios verificados
            </Text>
          </Checkbox>
        </Stack>
        <Body
          loading={loading}
          error={error}
          prices={prices.prices}
          condition={condition}
          url={url}
          paymentMethod={paymentMethod}
        />
      </Box>
    </VStack>
  );
};

export default App;
