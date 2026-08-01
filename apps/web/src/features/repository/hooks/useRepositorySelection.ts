import { useEffect, useMemo, useState } from "react";
import type { Branch, Repository } from "@pullwise/shared";
import {
  fetchBranches,
  fetchRepositories,
} from "../api/repository.api";

export function useRepositorySelection(enabled: boolean) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [repository, setRepository] = useState("");
  const [baseBranch, setBaseBranch] = useState("");
  const [headBranch, setHeadBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    fetchRepositories()
      .then((items) => {
        setRepositories(items);
        setRepository(items[0]?.fullName || "");
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !repository) return;
    setLoading(true);
    fetchBranches(repository)
      .then((items) => {
        setBranches(items);
        setBaseBranch(items[0]?.name || "");
        setHeadBranch(items[1]?.name || "");
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [enabled, repository]);

  const activeRepository = useMemo(
    () => repositories.find((item) => item.fullName === repository),
    [repositories, repository],
  );

  return {
    repositories,
    branches,
    repository,
    baseBranch,
    headBranch,
    activeRepository,
    loading,
    error,
    setRepository,
    setBaseBranch,
    setHeadBranch,
  };
}
