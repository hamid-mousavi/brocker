import { useEffect, useState } from 'react';
import { getAgents } from '../../lib/api';
import type { Broker } from '../types';

export function useAgents(page = 1, pageSize = 10, port?: string, service?: string) {
  const [agents, setAgents] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<{ page: number; pageSize: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAgents(page, pageSize, port, service)
      .then(res => {
        if (!mounted) return;
        if (res.success) {
          setAgents(res.data ?? []);
          setMeta(res.meta ?? null);
        } else {
          setError(res.message ?? 'خطا در دریافت اطلاعات');
        }
      })
      .catch(err => {
        if (!mounted) return;
        setError(err?.message ?? JSON.stringify(err));
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [page, pageSize, port, service]);

  return { agents, loading, meta, error };
}