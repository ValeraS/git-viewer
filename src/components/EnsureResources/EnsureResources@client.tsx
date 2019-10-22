import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, matchPath } from 'react-router';
import { fetchPageData } from 'app-store/page-data/actions';
import { getPageData, getPageUrl } from 'app-store/selectors/page-data';
import { getRepo } from 'app-store/selectors/repo';
import { fetchRepo } from 'app-store/repo/actions';
import { PageResources } from 'components/App/App';

type EnsureResourcesProps = {
  children: (state: PageResources) => JSX.Element;
};

export const EnsureResources = function({ children }: EnsureResourcesProps) {
  const location = useLocation();
  const repo = useSelector(getRepo);
  const data = useSelector(getPageData);
  const pageUrl = useSelector(getPageUrl);
  const [state, setState] = useState<PageResources>({ location, repo, data });
  const [updateView, setUpdateView] = useState(false);

  const dispatch = useDispatch();
  const match = matchPath<{ repoId: string }>(location.pathname, '/:repoId');

  const nextRepoId = (match && match.params.repoId) || '';
  const needUpdateRepo = nextRepoId !== (repo && repo.repoId);
  const needUpdatePageData = location.pathname !== pageUrl;

  useEffect(() => {
    async function waitForSources(sources: Promise<void>[]) {
      await Promise.all(sources);
      setUpdateView(true);
    }
    const sources = [];
    if (needUpdatePageData) {
      sources.push(dispatch(fetchPageData(location.pathname)));
    }
    if (needUpdateRepo) {
      sources.push(dispatch(fetchRepo(nextRepoId)));
    }
    if (sources.length) {
      //eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      waitForSources(sources);
    }
  }, [
    location.pathname,
    needUpdatePageData,
    dispatch,
    needUpdateRepo,
    nextRepoId,
  ]);

  if (updateView) {
    setUpdateView(false);
    setState({ location, repo, data });
  }

  // eslint-disable-next-line
  const memorizedChildren = useCallback(() => children(state), [state]);
  return memorizedChildren();
};
