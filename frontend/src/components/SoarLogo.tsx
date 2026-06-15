import logo from '../assets/logo.png';

export function SoarLogo({ size = 28 }: { size?: number }) {
  return (
    <>
      <img
        src={logo}
        alt="SOAR"
        style={{
          height: size * 2,
          objectFit: 'contain'
        }}
      />
    </>
  );
}