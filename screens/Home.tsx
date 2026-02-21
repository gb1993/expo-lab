import CustomText from '../components/CustomText';
import Header from '../components/Header';
import LastsLoans from '../components/LastsLoans';

export default function Home() {
  return (
    <>
      <Header />
      <CustomText text="Home" />
      <LastsLoans />
    </>
  );
}
