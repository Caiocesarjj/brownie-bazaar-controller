
import React, { useState, useEffect } from 'react';

interface AsyncDataHookResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * A custom hook to handle async data fetching with loading and error states
 */
export function useAsyncData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
): AsyncDataHookResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

/**
 * A higher-order component that adds async data loading capability to any component
 */
export function withAsyncData<T, P extends { data: T }>(
  WrappedComponent: React.ComponentType<P>,
  fetchFunction: () => Promise<T>,
  LoadingComponent: React.ComponentType = () => <div>Carregando...</div>,
  ErrorComponent: React.ComponentType<{ error: Error }> = ({ error }) => <div>Erro: {error.message}</div>
) {
  return function WithAsyncDataComponent(props: Omit<P, 'data'>) {
    const { data, loading, error } = useAsyncData<T>(fetchFunction);
    
    if (loading) return <LoadingComponent />;
    if (error) return <ErrorComponent error={error} />;
    if (!data) return <div>Nenhum dado encontrado</div>;
    
    return <WrappedComponent {...props as any} data={data} />;
  };
}

/**
 * A component that handles loading states and renders children only when data is available
 */
interface AsyncDataContainerProps<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  children: (data: T) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: Error) => React.ReactNode;
}

export function AsyncDataContainer<T>({
  data,
  loading,
  error,
  children,
  loadingComponent = <div className="p-4 text-center">Carregando...</div>,
  errorComponent = (error) => <div className="p-4 text-center text-red-500">Erro: {error.message}</div>
}: AsyncDataContainerProps<T>) {
  if (loading) return <>{loadingComponent}</>;
  if (error) return <>{errorComponent(error)}</>;
  if (!data) return <div className="p-4 text-center">Nenhum dado encontrado</div>;
  
  return <>{children(data)}</>;
}
