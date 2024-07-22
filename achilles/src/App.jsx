import { Achilles } from './components/achilles/achilles';
import InsertionSort from './components/achilles/implementations/insertion_sort';
import MergeSort from './components/achilles/implementations/merge_sort.jsx';
import SelectionSort from './components/achilles/implementations/selection_sort.jsx';

function App() {

  return (
    <>
      <h1>byte-wise</h1>
      <Achilles stageClass={MergeSort} />
    </>
  )
}

export default App
