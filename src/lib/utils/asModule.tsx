import React, { useCallback, useState } from 'react';
import { IDataSource, IModule, ModuleComponentProps } from '../types';

interface Options {
  name: string;
}

function asModule<TData extends {}, TActions extends string | number | symbol>(
  Component: React.ComponentType<ModuleComponentProps<TData, TActions>>,
  options: Options,
  dataSource: IDataSource<TData, TActions>,
): IModule<TData, TActions> {
  const ModuleComponent: React.ComponentType<
    ModuleComponentProps<TData, TActions>
  > = props => {
    const [data, setData] = useState<TData>(dataSource.getData());

    const callDispatch = useCallback(async (action: TActions, value?: any) => {
      await dataSource.callAction(action, value);
      setData(dataSource.getData());
    }, []);

    return (
      <Component
        {...props}
        data={data}
        callDispatch={callDispatch}
        actions={dataSource.actions}
      />
    );
  };

  return {
    name: options.name,
    Component: ModuleComponent,
  };
}

export default asModule;
