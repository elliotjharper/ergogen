#pragma once
// Force the usage of PIO1 peripheral, 
// by default the Serial implementation uses the PIO0 peripheral
#define SERIAL_PIO_USE_PIO1
#define SERIAL_USART_TX_PIN B6 // CHOOSE A PIN FOR HALF DUPLEX Transmission