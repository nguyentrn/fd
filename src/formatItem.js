const formatItem = (data, area) => {
  delete data.BookingMobileUrl;
  delete data.PromotionPlainTitle;
  delete data.PicturePath;
  delete data.PicturePathLarge;
  delete data.MobilePicturePath;
  delete data.Reviews;
  delete data.DocumentType;
  delete data.Floor;
  delete data.HasVideo;
  delete data.TotalPicturesFormat;
  delete data.TotalReviewsFormat;
  delete data.FriendAction;
  delete data.IconUrl;
  delete data.AlbumUrl;
  delete data.ReviewUrl;
  delete data.AvgRating;
  delete data.Phone;
  delete data.SubItems;
  delete data.IsAd;
  delete data.ShowInSearchResult;
  delete data.IsOpening;
  delete data.ReviewsTest;
  delete data.BankCards;
  delete data.CategoryGroupKey;
  delete data.DistrictUrl;
  delete data.AdsProviders;
  delete data.HasAlredyAddedToList;
  delete data.SpecialDesc;
  delete data.Promotions;
  delete data.Latitude;
  delete data.Longitude;
  delete data.MasterCategoryId;
  delete data.Location;
  delete data.Distance;
  delete data.DistrictId;
  delete data.PictureCount;
  delete data.HasBooking;
  delete data.HasDelivery;

  const item = {
    name: data.Name,
    id: data.Id,
    detail_url: data.DetailUrl,
    address: data.Address,
    district: data.District,
    city: data.City,
    total_review: data.TotalReview,
    total_view: data.TotalView,
    total_favourite: data.TotalFavourite,
    total_checkins: data.TotalCheckins,
    total_saves: data.TotalSaves,
    total_pictures: data.TotalPictures,
    avg_rating: data.AvgRatingOriginal,
    category: data.MainCategoryId,
    status: data.Status,
    booking: data.BookingUrl !== "" ? data.BookingUrl : null,
    delivery: data.DeliveryUrl !== "" ? data.DeliveryUrl : null,
    branch: data.BranchUrl !== "" ? data.BranchUrl : null,
    cuisines: data.Cuisines.map(({ Name }) => Name),
    categories: data.Categories.map(({ Name }) => Name),
    area,
    updated_at: new Date(),
  };
  return item;
};

export default formatItem;
