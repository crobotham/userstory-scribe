
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStoryCounts = (projectIds: string[]) => {
  const [storyCounts, setStoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStoryCounts = async () => {
      if (!projectIds || projectIds.length === 0) return;
      
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const counts: Record<string, number> = {};
        
        for (const projectId of projectIds) {
          counts[projectId] = 0;
          const { data, error } = await supabase
            .from('user_stories')
            .select('id')
            .eq('user_id', user.id)
            .eq('project_id', projectId);

          if (error) {
            console.error(`Error fetching stories for project ${projectId}:`, error);
            continue;
          }

          if (data) {
            counts[projectId] = data.length;
          }
        }

        setStoryCounts(counts);
      } catch (error) {
        console.error("Error loading story counts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoryCounts();
  }, [projectIds]);

  return {
    storyCounts,
    isLoading
  };
};
