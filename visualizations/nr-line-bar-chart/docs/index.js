import React from 'react';

import {
  Card,
  CardHeader,
  CardBody,
  HeadingText,
  Link,
  BlockText,
  Spacing
} from 'nr1';

const properties = require('../nr1.json');

// if the key matches a config property name, the additional information will be added
const additionalDocs = {
  tickFormat: {
    description: '', // optional override of the property config description
    additionalInfo: '', // optional extra info
    links: [
      {
        name: 'Parsing documentation',
        link: 'https://day.js.org/docs/en/display/format'
      }
    ]
  }
};

const renderNr1Props = (config, isNested) => {
  const { name, title, description, type, items } = config;
  const extraDocs = additionalDocs[name];

  if (type === 'collection') {
    return (
      <div>
        <HeadingText type={HeadingText.TYPE.HEADING_5}>{title}</HeadingText>
        <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
          {description || extraDocs?.description || 'No description provided.'}
        </BlockText>

        {items.map(item => {
          return renderNr1Props(item, true);
        })}
      </div>
    );
  }

  return (
    <div key={name} style={{ paddingLeft: isNested ? '15px' : '0px' }}>
      <HeadingText
        type={
          isNested ? HeadingText.TYPE.HEADING_6 : HeadingText.TYPE.HEADING_5
        }
      >
        {title}
      </HeadingText>
      <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
        {description || extraDocs?.description || 'No description provided.'}
      </BlockText>

      {extraDocs?.additionalInfo && (
        <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
          {extraDocs?.additionalInfo}
        </BlockText>
      )}

      <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
        {extraDocs?.links && (
          <>
            <HeadingText
              type={HeadingText.TYPE.HEADING_6}
              style={{ paddingBottom: '5px' }}
            >
              Links
            </HeadingText>

            <BlockText>
              {extraDocs.links.map((l, i) => (
                <code key={i}>
                  <Link to={l.link}>{l.name}</Link>
                  <br />
                </code>
              ))}
            </BlockText>
          </>
        )}
      </BlockText>
      <br />
    </div>
  );
};

export default function Docs() {
  return (
    <div style={{ textAlign: 'left' }}>
      <HeadingText type={HeadingText.TYPE.HEADING_2}>Documentation</HeadingText>
      <Card collapsible>
        <CardHeader title="Query Syntax" />
        <CardBody style={{ marginLeft: '35px' }}>
          <BlockText spacingType={[BlockText.SPACING_TYPE.MEDIUM]}>
            In order to populate the chart, there are a few requirements:
            <Spacing type={[Spacing.TYPE.MEDIUM, Spacing.TYPE.EXTRA_LARGE]}>
              <ul>
                <li>At least 1 bar query and 1 time query</li>
                <li>
                  Each query must use the <code>TIMESERIES</code> clause, with
                  the same bucket eg. <code>TIMESERIES 1 day</code>
                </li>
                <li>
                  If using the <code>SINCE</code> clause it is strongly
                  recommended to be the same across all configured queries
                </li>
                <li>
                  Only use unique names for your line and bar queries to avoid
                  issues.
                </li>
              </ul>
            </Spacing>
            <Spacing type={[Spacing.TYPE.MEDIUM]}>
              <div>A valid bar query for the chart could look like this: </div>
            </Spacing>
            <Spacing type={[Spacing.TYPE.MEDIUM, Spacing.TYPE.LARGE]}>
              <code>
                SELECT percentile(duration, 80) as 'Load' from PageView
                TIMESERIES 1 day since last week
              </code>
            </Spacing>
            <Spacing type={[Spacing.TYPE.MEDIUM]}>
              <div>A valid line query for the chart could look like this: </div>
            </Spacing>
            <Spacing type={[Spacing.TYPE.MEDIUM, Spacing.TYPE.LARGE]}>
              <code>
                SELECT count(*) as 'Views' from PageView TIMESERIES 1 day since
                last week
              </code>
            </Spacing>
          </BlockText>
        </CardBody>
      </Card>

      <Card collapsible>
        <CardHeader title="Properties" />
        <CardBody style={{ marginLeft: '35px' }}>
          {properties.configuration
            .filter(c => c.name !== 'showDocs')
            .map(config => {
              return renderNr1Props(config);
            })}
        </CardBody>
      </Card>

      <hr />
    </div>
  );
}
