import { useState, useRef, useEffect } from 'react';
import { Carousel, Card, Button, Image, message, Spin } from 'antd';
import ReactPlayer from 'react-player';
import { CarouselRef } from 'antd/es/carousel';
import { Link, useParams } from 'react-router-dom';

import { useGetPlaylistMediaById } from '../../hooks/Media';
import FallbackImage from '../../assets/loading-image.png';

import styles from './DigitalPlayer.module.scss';
import { useGetPlaylistById } from '../../hooks/Playlists';

const DigitalPlayer = () => {
  const params = useParams();
  const { playlistId } = params;

  const getPlaylistByIdQuery = useGetPlaylistById(playlistId ?? '');

  if (getPlaylistByIdQuery.error)
    message.error(
      `An error occurred while retrieving media for playlist. Ensure server is reachable and refresh page.`,
      3
    );

  const playlistItem = getPlaylistByIdQuery?.data ?? { name: '' };

  const getPlaylistMediaQuery = useGetPlaylistMediaById(playlistId ?? '');

  if (getPlaylistMediaQuery.error)
    message.error(
      `An error occurred while retrieving media for playlist. Ensure server is reachable and refresh page.`,
      3
    );

  const mediaItems = getPlaylistMediaQuery?.data ?? [];

  const [isVideoPlayingArr, setIsVideoPlayingArr] = useState<boolean[]>([]);
  const [autoPlaying, setAutoPlaying] = useState(true);

  const mediaLen = mediaItems.length;
  useEffect(() => {
    if (mediaLen > 0) setIsVideoPlayingArr(Array(mediaLen).fill(false));
  }, [mediaLen]);

  const imgCarouselRef = useRef<CarouselRef | null>(null);
  const titleCarouselRef = useRef<CarouselRef | null>(null);
  const videosRef = useRef<ReactPlayer[]>([]);

  if (getPlaylistMediaQuery.isLoading)
    return (
      <div className={styles.load}>
        <Spin />
      </div>
    );

  const handleGoToNext = () => {
    setAutoPlaying(true);
    imgCarouselRef.current?.next();
  };

  const handleChangeTitle = (currentSlide: number) => {
    titleCarouselRef.current?.goTo(currentSlide);
  };

  const showErrorMessage = (type: 'image' | 'video') => {
    message.error(`An error occurred while loading the ${type}.`, 3, handleGoToNext);
  };

  const updateVideoAtIndex = (index: number, value: boolean) => {
    setIsVideoPlayingArr((prevValue) => {
      const newValue = [...prevValue];
      newValue[index] = value;
      return newValue;
    });
  };
  const handleVideoEnded = (index: number) => {
    updateVideoAtIndex(index, false);
    handleGoToNext();
    videosRef.current[index].seekTo(0, 'seconds');
  };

  const handleStartVideo = (currentSlide: number) => {
    setAutoPlaying(false);
    updateVideoAtIndex(currentSlide, true);
  };

  const handleOnChangeCarusel = (_: number, currentSlide: number) => {
    handleChangeTitle(currentSlide);
    if (currentSlide < 0 || mediaItems[currentSlide]?.type !== 'VIDEO') return;
    handleStartVideo(currentSlide);
  };

  return (
    <div className={styles.digitalPlayerPage}>
      <Card
        hoverable
        title={`Playlist: ${playlistItem.name}`}
        extra={
          <Link to={`/playlists/${playlistId}`}>
            <Button type='link'>Back</Button>
          </Link>
        }
        cover={
          <Carousel
            lazyLoad='ondemand'
            dots={false}
            autoplay={autoPlaying}
            autoplaySpeed={7000}
            ref={(c) => (imgCarouselRef.current = c)}
            beforeChange={handleOnChangeCarusel}
            // onLazyLoad={handleOnChangeCarusel}
          >
            {mediaItems.map((media, index) => {
              if (media.type === 'IMAGE')
                return (
                  <Image
                    key={media.id}
                    preview={false}
                    alt={Image.name}
                    src={media.url}
                    fallback={FallbackImage}
                    rootClassName='player-view'
                    onError={() => showErrorMessage('image')}
                  />
                );

              return (
                <ReactPlayer
                  muted
                  playing={isVideoPlayingArr[index]}
                  onError={() => showErrorMessage('video')}
                  controls={false}
                  key={media.id}
                  width='100%'
                  height='500px'
                  url={media.url}
                  ref={(r) => {
                    if (r) videosRef.current[index] = r;
                  }}
                  className='player-view'
                  onEnded={() => handleVideoEnded(index)}
                />
              );
            })}
          </Carousel>
        }
      >
        <Carousel
          effect='fade'
          dots={false}
          speed={1000}
          ref={(c) => (titleCarouselRef.current = c)}
        >
          {mediaItems.map((item) => (
            <Card.Meta key={item.id} title={item.name} description={item.url} />
          ))}
        </Carousel>
      </Card>
    </div>
  );
};

export default DigitalPlayer;
