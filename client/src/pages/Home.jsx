
import BestSeller from '../components/BestSeller';
import BottomBanner from '../components/BottomBanner';
import Categories from '../components/Categories';
import CommunitySection from '../components/CommunitySection';
import MainBanner from '../components/MainBanner';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
    return (
        <div className='mt-10'>
            <MainBanner></MainBanner>
            <Categories/>
            <BestSeller/>
            <CommunitySection/>
            <BottomBanner/>
            <NewsLetter/>
        </div>
    );
};

export default Home;