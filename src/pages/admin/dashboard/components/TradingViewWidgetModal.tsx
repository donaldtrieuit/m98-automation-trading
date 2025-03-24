import React, { useEffect, useMemo, useRef } from 'react';
import { Modal } from 'antd';

// Define TradingView widget options interface
interface TradingViewWidgetOptions {
  width: string | number;
  symbol: string;
  interval: string;
  timezone: string;
  theme: 'light' | 'dark';
  style: string;
  locale: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  hide_side_toolbar: boolean;
  container_id: string;
}

// Extend the Window interface to include TradingView
// eslint-disable-next-line prettier/prettier
declare global {
  interface Window {
    TradingView: {
      widget: new (options: TradingViewWidgetOptions) => any;
    };
  }
}

// Define props interface
interface TradingViewWidgetModalProps {
  open: boolean;
  typeTheme: 'light' | 'dark';
  language: string;
  onClose: () => void;
  dataFlow: {
    symbol?: string;
    exchange_code?: string;
    mode?: string;
  };
  timezone: string;
}

let tvScriptLoadingPromise: Promise<void> | undefined;

const TradingViewWidgetModal: React.FC<TradingViewWidgetModalProps> = ({
  open,
  typeTheme,
  language,
  onClose,
  dataFlow,
  timezone,
}) => {
  // Correctly type onLoadScriptRef to hold a function or null
  const onLoadScriptRef = useRef<(() => void) | null>(null);

  const cryptoParam = useMemo<string | undefined>(() => {
    const { symbol, exchange_code, mode } = dataFlow;
    if (!symbol || !exchange_code || !mode) return undefined;
    const converSymbol = symbol.replace('/', '').toUpperCase();
    const isFuture = mode === 'future' ? '.P' : '';
    return `${exchange_code.toUpperCase()}:${converSymbol}${isFuture}`;
  }, [dataFlow]);

  useEffect(() => {
    if (!open) return;

    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => {
      onLoadScriptRef.current = null;
    };

    function createWidget(): void {
      if (document.getElementById('tradingviewContainer') && 'TradingView' in window && cryptoParam) {
        new window.TradingView.widget({
          width: '100%',
          symbol: cryptoParam,
          interval: '60',
          timezone,
          theme: typeTheme,
          style: '1',
          locale: language,
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false,
          container_id: 'tradingviewContainer',
        });
      }
    }
  }, [open, cryptoParam, typeTheme, language, timezone]);

  return (
    <Modal centered title="Trading View" open={open} footer={null} onCancel={onClose} width={1200}>
      <div className="tradingview-widget-container">
        <div id="tradingviewContainer" />
      </div>
    </Modal>
  );
};

export default TradingViewWidgetModal;