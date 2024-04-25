import React, { createContext, useContext, useMemo, useRef } from 'react';
import initialize from './initialize';
import ClarityAPI from './API';
import { Clarity } from './types/clarity-js';

interface ClarityProviderProps {
  clarityId: string;
}

const ClarityContext = createContext<Clarity | undefined>(undefined);

export const ClarityProvider: React.FC<
  React.PropsWithChildren<ClarityProviderProps>
> = ({ clarityId, ...rest }) => {
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    initialize(clarityId);
    isInitialized.current = true;
  }

  const start: Clarity['start'] = (config) => {
    ClarityAPI('start', config);
  };

  const stop: Clarity['stop'] = () => {
    ClarityAPI('stop');
  };
  const pause: Clarity['pause'] = () => {
    ClarityAPI('pause');
  };
  const resume: Clarity['resume'] = () => {
    ClarityAPI('resume');
  };
  const upgrade: Clarity['upgrade'] = (key) => {
    ClarityAPI('upgrade', key);
  };
  const consent: Clarity['consent'] = () => {
    ClarityAPI('consent');
  };
  const event: Clarity['event'] = (name, data) => {
    ClarityAPI('event', name, data);
  };
  const set: Clarity['set'] = (key, value) => {
    ClarityAPI('set', key, value);
  };
  const identify: Clarity['identify'] = (
    userId,
    sessionId,
    pageId,
    userHint
  ) => {
    ClarityAPI('identify', userId, sessionId, pageId, userHint);
  };

  const metadata: Clarity['metadata'] = (callback, wait) => {
    ClarityAPI('metadata', callback, wait);
  };

  const signal: Clarity['signal'] = (callback) => {
    ClarityAPI('signal', callback);
  };

  const providerValue = useMemo<Clarity>(() => {
    return {
      clarityId,
      start,
      stop,
      pause,
      resume,
      upgrade,
      consent,
      event,
      set,
      identify,
      metadata,
      signal,
    };
  }, [clarityId]);

  return (
    <ClarityContext.Provider value={providerValue}>
      {rest.children}
    </ClarityContext.Provider>
  );
};

export const useClarity = () => {
  const context = useContext(ClarityContext);

  if (context === undefined) {
    throw new Error('"useClarity" must be used within `ClarityProvider`.');
  }

  return context as Clarity;
};
