import React from 'react';
import { RouteProps } from 'react-router';
import { Route, Navigate } from 'react-router-dom';
import { useAuthState } from '../../contexts';

export interface PrivateRouteProps extends RouteProps {
  redirectPath: string;
}

export const PrivateRoute = ({ redirectPath, ...props }: PrivateRouteProps) => {
  const { user } = useAuthState();
  if (!user) {
    return <Navigate to={redirectPath} />;
  }
  return <Route {...props} />;
};