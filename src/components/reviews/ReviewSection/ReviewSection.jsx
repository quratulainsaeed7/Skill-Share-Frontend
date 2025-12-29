import React, { useState, useEffect } from 'react';
import ReviewApi from '../../../api/ReviewApi';
import UserService from '../../../services/UserService';
import Button from '../../common/Button/Button';
import styles from './ReviewSection.module.css';

const ReviewSection = ({ skillId, mentorId, isEnrolled }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [averageRating, setAverageRating] = useState(null);
    const [userReview, setUserReview] = useState(null);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });

    const currentUser = UserService.getUser();

    useEffect(() => {
        fetchReviews();
        fetchAverageRating();
    }, [mentorId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const mentorReviews = await ReviewApi.getReviewsByMentor(mentorId);
            setReviews(mentorReviews);

            // Check if current user has already reviewed
            if (currentUser?.userId) {
                const existingUserReview = mentorReviews.find(
                    review => review.learnerId === currentUser.userId
                );
                setUserReview(existingUserReview);
            }
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const fetchAverageRating = async () => {
        try {
            const avgRating = await ReviewApi.getAverageRatingForMentor(mentorId);
            setAverageRating(avgRating);
        } catch (err) {
            console.error('Failed to fetch average rating:', err);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!reviewForm.comment.trim()) {
            alert('Please write a review comment');
            return;
        }

        if (!currentUser?.userId) {
            alert('Please login to submit a review');
            return;
        }

        setSubmitting(true);

        try {
            const reviewData = {
                learnerId: currentUser.userId,
                mentorId,
                rating: reviewForm.rating,
                comment: reviewForm.comment.trim()
            };

            const newReview = await ReviewApi.createReview(reviewData);
            
            // Add new review to the list
            setReviews([newReview, ...reviews]);
            setUserReview(newReview);
            
            // Reset form
            setReviewForm({ rating: 5, comment: '' });
            setShowReviewForm(false);
            
            // Refresh average rating
            fetchAverageRating();
            
            alert('Review submitted successfully!');
        } catch (err) {
            console.error('Failed to submit review:', err);
            alert(err.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRatingChange = (rating) => {
        setReviewForm({ ...reviewForm, rating });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const renderStars = (rating, interactive = false, onChange = null) => {
        return (
            <div className={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`${styles.star} ${star <= rating ? styles.starFilled : styles.starEmpty} ${interactive ? styles.starInteractive : ''}`}
                        onClick={() => interactive && onChange && onChange(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Reviews</h2>
                <div className={styles.loadingState}>Loading reviews...</div>
            </div>
        );
    }

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.sectionTitle}>Reviews</h2>
                    {averageRating && averageRating.averageRating !== undefined && (
                        <div className={styles.averageRating}>
                            <span className={styles.ratingNumber}>{averageRating.averageRating.toFixed(1)}</span>
                            {renderStars(Math.round(averageRating.averageRating))}
                            <span className={styles.reviewCount}>
                                ({averageRating.totalReviews || 0} {averageRating.totalReviews === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>
                    )}
                </div>

                {/* Show review button only if enrolled and hasn't reviewed yet */}
                {isEnrolled && !userReview && (
                    <Button
                        variant="primary"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                        {showReviewForm ? 'Cancel' : 'Write a Review'}
                    </Button>
                )}
            </div>

            {error && (
                <div className={styles.error}>
                    <span>⚠️ {error}</span>
                </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <div className={styles.reviewForm}>
                    <h3 className={styles.formTitle}>Share Your Experience</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div className={styles.formGroup}>
                            <label>Your Rating</label>
                            {renderStars(reviewForm.rating, true, handleRatingChange)}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="reviewComment">Your Review</label>
                            <textarea
                                id="reviewComment"
                                rows="5"
                                placeholder="Share your thoughts about this course and mentor..."
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                className={styles.textarea}
                                disabled={submitting}
                                required
                            />
                        </div>
                        <div className={styles.formActions}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setReviewForm({ rating: 5, comment: '' });
                                }}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* User's existing review */}
            {userReview && (
                <div className={styles.userReviewNotice}>
                    <span>✓ You have already reviewed this course</span>
                </div>
            )}

            {/* Reviews List */}
            <div className={styles.reviewsList}>
                {reviews.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.reviewId}
                            className={`${styles.reviewItem} ${review.learnerId === currentUser?.userId ? styles.userReviewItem : ''}`}
                        >
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewUser}>
                                    <div className={styles.reviewAvatar}>
                                        {review.learnerName ? review.learnerName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <span className={styles.reviewName}>
                                            {review.learnerName || 'Anonymous'}
                                            {review.learnerId === currentUser?.userId && (
                                                <span className={styles.youBadge}> (You)</span>
                                            )}
                                        </span>
                                        <div className={styles.reviewMeta}>
                                            {renderStars(review.rating)}
                                            <span className={styles.reviewDate}>
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className={styles.reviewText}>{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
