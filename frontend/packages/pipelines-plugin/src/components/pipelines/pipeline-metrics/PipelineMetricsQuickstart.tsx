import * as React from 'react';
import { QuickStartContextValues, QuickStartContext } from '@patternfly/quickstarts';
import { Alert, AlertVariant } from '@patternfly/react-core';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import QuickStartsLoader from '@console/app/src/components/quick-starts/loader/QuickStartsLoader';
import { isModifiedEvent } from '@console/shared/src';
import { PipelineMetricsLevel } from '../const';

type PipelineMetricsQuickstartInfoProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  to: { pathname: string; search: string };
};

type PipelineMetricsQuickstartProps = {
  metricsLevel?: string;
};

export const PipelineMetricsQuickstartInfo: React.FC<PipelineMetricsQuickstartInfoProps> = ({
  onClick,
  to,
}) => (
  <Trans ns="pipelines-plugin">
    Administrators can try{' '}
    <Link to={to} onClick={onClick}>
      this quick start
    </Link>{' '}
    to configure their metrics level to pipelinerun and taskrun. The pipelinerun and taskrun metrics
    level collects large volume of metrics over time in unbounded cardinality which may lead to
    metrics unreliability.
  </Trans>
);

const PipelineMetricsQuickstart: React.FC<PipelineMetricsQuickstartProps> = ({ metricsLevel }) => {
  const { t } = useTranslation();
  const PIPELINE_METRICS_CONFIGURATION_QUICKSTART = 'configure-pipeline-metrics';
  const { pathname, search } = useLocation();
  const { setActiveQuickStart } = React.useContext<QuickStartContextValues>(QuickStartContext);
  const queryParams = new URLSearchParams(search);
  queryParams.set('quickstart', PIPELINE_METRICS_CONFIGURATION_QUICKSTART);

  const to = {
    pathname,
    search: `?${queryParams.toString()}`,
  };

  return (
    <QuickStartsLoader>
      {(quickStarts, loaded) => {
        const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
          if (isModifiedEvent(event)) {
            return;
          }
          setActiveQuickStart(PIPELINE_METRICS_CONFIGURATION_QUICKSTART);
        };

        const isPipelineMetricsQSAvailable =
          loaded &&
          quickStarts?.length > 0 &&
          !!quickStarts.find(
            (qs) => qs.metadata.name === PIPELINE_METRICS_CONFIGURATION_QUICKSTART,
          );

        return (
          <>
            {isPipelineMetricsQSAvailable && (
              <Alert
                variant={
                  metricsLevel === PipelineMetricsLevel.UNSUPPORTED_LEVEL
                    ? AlertVariant.warning
                    : AlertVariant.info
                }
                isInline
                title={
                  metricsLevel === PipelineMetricsLevel.UNSUPPORTED_LEVEL
                    ? t('pipelines-plugin~Pipeline metrics configuration is unsupported.')
                    : t(
                        'pipelines-plugin~Pipeline metrics configuration defaults to pipeline and task level.',
                      )
                }
              >
                <PipelineMetricsQuickstartInfo
                  data-test-id="pipeline-metrics-quickstart-link"
                  to={to}
                  onClick={handleOnClick}
                />
              </Alert>
            )}
          </>
        );
      }}
    </QuickStartsLoader>
  );
};

export default PipelineMetricsQuickstart;
