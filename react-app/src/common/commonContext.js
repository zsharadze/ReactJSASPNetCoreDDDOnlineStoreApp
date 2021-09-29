import React from 'react'

const CommonContext = React.createContext()

export const CommonProvider = CommonContext.Provider;
export const CommonConsumer = CommonContext.Consumer;

export default CommonContext;