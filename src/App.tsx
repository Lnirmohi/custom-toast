import './App.css';
// import FeatureCompare from './components/FeatureCompare';
import ToastContainer from './components/ToastContainer';
import { toast } from './utils/toastBus';

function App() {
  
  return (
    <div className='w-screen h-screen flex gap-3 align-middle justify-center items-start '>
      <ToastContainer />
      <button className='py-2 px-4 bg-green-400 text-white font-semibold rounded-lg self-center hover:cursor-pointer hover:shadow-lg active:scale-95'
        onClick={() => {
          toast.success('toast success');
        }}
      >
        Show Success
      </button>
      <button className='py-2 px-4 bg-red-400 text-white font-semibold rounded-lg self-center hover:cursor-pointer hover:shadow-lg active:scale-95'
        onClick={() => {
          toast.error('toast error');
        }}
      >
        Show Error
      </button>
      <button className='py-2 px-4 bg-blue-400 text-white font-semibold rounded-lg self-center hover:cursor-pointer hover:shadow-lg active:scale-95'
        onClick={() => {
          toast.info('toast info');
        }}
      >
        Show Info
      </button>
    </div>
  );
}

export default App;
