import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Open Source',
    Svg: require('@site/static/img/open-source.svg').default,
    description: (
      <>
        VCkit is open source software, meaning it's free to use, modify, and distribute. You can customize it to your needs, and it's constantly being improved by a community of developers.
      </>
    ),
  },
  {
    title: 'Interoperable',
    Svg: require('@site/static/img/interoperable.svg').default,
    description: (
      <>
        Our goal is to facilitate interoperability among diverse international trade stakeholders by enabling seamless integration with existing systems and standards, streamlining processes, increasing efficiency, and promoting trust and transparency in transactions.
      </>
    ),
  },
  {
    title: 'Built on Open Standards',
    Svg: require('@site/static/img/open-standards.svg').default,
    description: (
      <>
        Built on open standards, VCkit ensures compatibility with established technologies, protocols, and frameworks, enabling seamless integration, enhancing interoperability, and promoting innovation in the international trade ecosystem.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}

        </div>
      </div>
    </section>
  );
}
