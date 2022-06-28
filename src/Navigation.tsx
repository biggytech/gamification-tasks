import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { IModule } from './lib/types';

const Drawer = createDrawerNavigator();

interface NavigationProps {
  modules: IModule<any, any>[];
}

const Navigation: React.FC<NavigationProps> = ({ modules }) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {modules.map(({ name, Component }) => (
          <Drawer.Screen key={name} name={name} component={Component} />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
