import Image from 'next/image';
import router from 'next/router';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  function handleClickLogo(): void {
    router.push('/');
  }

  return (
    <header>
      <div className={styles.headerContent}>
        <span onClick={handleClickLogo} role="presentation">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width="238.62"
            height="25.63"
          />
        </span>
      </div>
    </header>
  );
}
