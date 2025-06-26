import { useState, useEffect } from 'react';
import { getUserCircle, getCircleMembers } from '../api/circles';
import { supabase } from '../api/supabaseClient';

export function useCircle(userId: string) {
  const [circleId, setCircleId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCircle() {
      const assignedCircleId = await getUserCircle(userId);
      setCircleId(assignedCircleId);
      if (assignedCircleId) {
        const memberIds = await getCircleMembers(assignedCircleId);
        if (memberIds.length > 0) {
          const { data: userDetails } = await supabase
            .from('users')
            .select('id, full_name')
            .in('id', memberIds);
          setMembers(userDetails || []);
        } else {
          setMembers([]);
        }
      } else {
        setMembers([]);
      }
    }
    if (userId) fetchCircle();
  }, [userId]);

  return { circleId, members };
} 