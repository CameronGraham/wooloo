import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Activity {
  id: string;
  username: string;
  currently_watching: string;
}

const ActivityFeed: React.FC = () => {
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivity = async () => {
      const { data, error } = await supabase
        .from('activity')
        .select('*');

      if (error) {
        console.error('Error fetching activity', error);
      } else {
        setActivity(data as Activity[]);
      }
    };

    fetchActivity();

    const subscription = supabase
    .channel('public:activity')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity' }, payload => {
        const newActivity = payload.new as Activity;
        setActivity(prev => [newActivity, ...prev]);
      
        toast(`${newActivity.username} is currently watching ${newActivity.currently_watching}`, {
            className: 'bg-blue-500 text-white',
            bodyClassName: 'font-medium',
            progressClassName: 'bg-white',
        });
    })
    .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <ToastContainer
        theme="dark"
    />
  );
};

export default ActivityFeed;
