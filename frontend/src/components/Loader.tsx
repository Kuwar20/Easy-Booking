import LoadingIcon from '../assets/loading-twotone-loop.svg';

const Loader = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src={LoadingIcon} alt="SVG Image"/>
    </div>
  );
}

export default Loader;
