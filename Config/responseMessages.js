/**
 * Created by abhinav on 1/28/2016.
 */
'use strict';
//const CONSTANTS = require('./constants');
const ERROR_MESSAGES = {
    'SOMETHING_WRONG': 'Something went wrong.',
    'BANK_DETAILS_UNAPPROVED': 'Your bank details have not been yet approved.',
    'BANK_DETAILS_MISSING': 'You have not filled your bank details.',
    'EMAIL_NOT_SENT': 'Error while sending email, please try again later.',
    'INVALID_TIMEZONE': 'Invalid timezone.',
    'INVALID_OLD_PASSWORD': 'Invalid old password.',
    'LOCATION_NO_SERVICE': 'Sorry we don\'t serve on this location.',
    'DATA_NOT_FOUND': 'Data not found.',
    'NO_DATA_UPDATED': 'No data updated.',
    'INVALID_JOB_ID': 'Invalid job id',
    'NO_NEW_JOB_OFFERS': 'No job offers found.',
    'OTP_FAIL': 'OTP fail.',
    'BAD_REQUEST':'BAD REQUEST',
    'PARAMETER_MISSING': 'Parameters missing.',
    'OLD_PASSWORD_MISSING': 'Old password is required in order to change the password.',
    'NEW_PASSWORD_MISSING': 'New password is required in order to change the password.',
    'EXPERIENCE_MONTH': 'Experience in months missing.',
    'EXPERIENCE_YEAR': 'Experience in years missing.',
    'PHONE_AUTH_FAIL': 'You are not authorize to perform this action on this phone number.',
    'SERVING_LOCATION_NOT_EXITS': 'This serving location does not exists',
    'WRONG_PARAMETER': 'Wrong parameter.',
    'WAGE_MISSING': 'Wage is required.',
    'WAGE_OUT_OF_RANGE': 'Wage should be between',
    'INVALID_RANGE_ERROR': 'Invalid range.',
    'UPLOAD_ERROR': 'Error in uploading.',
    'DUPLICATE_ENTRY': 'Duplicate Entry.',
    'INVALID_ID': 'Invalid ID.',
    'USERNAME_OR_EMAIL_TAKEN':'USERNAME OR EMAIL TAKEN',
    'USER_NOT_VERIFIED':'User not verified,please check your email',
    'INVALID_REQUEST_ID': 'Invalid request id.',
    'INVALID_CARD_ID': 'Invalid card ID.',
    'INVALID_EMPLOYEE_ID': 'Invalid employee id.',
    'INVALID_EMAIL_VERIFY_ID': 'Invalid email verification request id',
    'INVALID_TOKEN': 'Invalid Token',
    'INVALID_FORGET_PASS_REQ_ID': 'Invalid reset password request id',
    'INVALID_CREDENTIALS':'INVALID_CREDENTIALS',
    'PHONE_NUMBER_ALREADY_EXISTS': 'Phone number already exists.',
    'PHONE_NUMBER_NOT_EXISTS': 'Phone number does not exists.',
    'PHONE_NUMBER_NOT_FOUND': "Couldn't find the phone number.",
    'SP_NOT_RANGE': 'No Service provider in range',
    'SERVICE_PROVIDER_BOOKED_ALREADY': 'Service provider already booked.',
    'EMAIL_ALREADY_EXISTS': 'Email already exists.',
    'EMPLOYEE_NOT_AVAIL': 'Oops! It seems no one is available.',
    'EMAIL_ALREADY_VERIFIED': 'Email already verified.',
    'EMAIL_VERIFY_REQUEST_EXPIRE': 'Email verification request expired.',
    'RESET_PASS_REQUEST_EXPIRE': 'Reset password request expired.',
    'LOGIN_ERROR': 'Invalid credentials.',
    'USER_NOT_FOUND': 'User not found.',
    'PHONE_VERIFY_FAIL': 'Phone number verification Failed.',
    'OTP_EXPIRED': 'OTP expired.',
    'USER_BLOCKED': 'You have been blocked by admin please contact support.',
    'PASSWORD_CHANGE_REQUEST_EXPIRE': 'Password change request has been expired.',
    'PASSWORD_CHANGE_REQUEST_INVALID': 'Invalid password change request.',
    'OLD_PASS_WRONG': 'Invalid old password.',
    'IMAGE_FORMAT_NOT_SUPPORTED': 'Unsupported image format.',
    'VIDEO_FORMAT_NOT_SUPPORTED': 'Unsupported video format.',
    'RESUME_FORMAT_NOT_SUPPORTED': 'Unsupported resume format.',
    'ERROR_ON_REGISTER_ADMIN': 'An error occurred while registering the admin, please try again later.',
    'ACCESS_DENIED': 'Access Denied.',
    'VERIFY_EMAIL': 'Please verify email to proceed.',
    'ACTION_NOT_ALLOWED': 'You are not allowed to perform this action.',
    'ALREADY_JOB_ACCEPTED': 'Oops!!, it seems someone else accepted this job.',
    'ALREADY_REQUEST_ACCEPTED': 'You have already accepted this request.',
    'ONLY_PENDING_JOB_DELETE': 'You can only delete jobs in initial stages.',
    'HIRE_ERROR': 'You cannot hire this worker right now.',
    'YOU_NOT_AVAILABLE': 'You are not available on this job timings.',
    'YOU_JOB_COMMIT': 'You already have a committed job.',
    'EMPLOYEE_NOT_AVAILABLE': 'Employee seems to be busy on this job timings now.',
    'ALREADY_FOLLOWED': 'You are already following this user.',
    'JOB_ALREADY_DECLINED': 'You have already declined the job.',
    'APPROVED_PROFILE_ERROR': 'Only under review or declined profile status can be approved.',
    'DECLINE_PROFILE_ERROR': 'Only under review or approved profile status can be declined.',
    'UNDER_REVIEW_PROFILE_ERROR': 'Only declined or approved profile status can be set with status under review.',
    'ALREADY_BLOCKED': 'User already blocked.',
    'ALREADY_NOT_FOLLOWED':'USER IS ALREADY UNFOLLOWED',
    'ALREADY_DELETED_JOB': 'Job already deleted.',
    'ALREADY_UNBLOCKED': 'User already unblocked.',
    'ORGANIZATION_SIZE_REQUIRED': 'Organization size is required.',
    'INVALID_EMAIL': "Invalid email.",
    'INVALID_INDUSTRY_ID': "Invalid industry id.",
    'ACTION_NO_AUTH': "You are not authorize to perform this action.",
    'BACKGROUND_VERIFY_DECLINE': "You need to complete the verification.",
    'BOOK_PAST_DATE': "Cannot create booking of past.",
    'USER_ALREADY_SAME_CALL_STATUS': 'User already have same call status.',
    'CARD_ADD_ERROR': "Couldn't add card, verify your card details or try again later.",
    'CARD_ALREADY_DEFAULT': "This card is already set as default card.",
    'CARD_DELETE_ERROR': "Couldn't delete card, please try again later.",
    'CUSTOMER_DELETE_ERROR': "Couldn't delete account, please try again later.",
    'CARD_DELETE_ONE': "Please set other card as default card to delete this one.",
    'PAYMENT_ERROR': "Payment fail, please try again later."
};
const SUCCESS_MESSAGES = {
    'REGISTRATION_SUCCESSFUL': 'You are Registered successfully.',
    'JOB_POST_SUCCESSFUL': 'Job posted successfully.',
    'EMAIL_SENT': 'Email sent successfully.',
    'EMAIL_VERIFIED': 'Email verified successfully.',
    'PASSWORD_RESET_SUCCESS': 'Password reset successfully.',
    'DETAILS_SUBMITTED': 'Details submitted successfully.',
    'BANK_DETAILS_PENDING': 'Your bank details are being verified.',
    'SUCCESSFULLY_ADDED': 'Successfully added.',
    'ACTION_COMPLETE': 'Action complete.',
    'PASS_LINK_SENT': 'Reset password link has been sent to the email id.',
    'LOGIN_SUCCESSFULLY': 'Logged in successfully.',
    'LOGOUT_SUCCESSFULLY': 'Logged out successfully.',
    'VALID_REQUEST': 'Valid request.',
    'CATEGORY_ADDED': 'Category added.',
    'SUBCATEGORY_ADDED': 'Subcategory added.',
    'SERVICE_ADDED': 'Service added.',
    'SUB_SERVICE_ADDED': 'Sub-service added.',
    'SERVING_LOCATION_ADDED': 'Serving Location added.',
    'BOOKING_CREATED': 'Booking created successfully.',
    'ATTACHMENT_UPLOAD': 'Attachment Uploaded successfully.'
};
const SOCKET_DEFAULT_MESSAGES = {
    'AUTH_FAIL': 'You are not authorize.',
    'AUTH_SUCCESS': 'You are authorized.',
    'INVALID_DATA': 'Invalid data.',
    'MSG_FAIL': 'Message not sent.',
    'COMM_NOT_AVAIL': "Sorry! no communicator available, we'll get back to you asap.",
    'USER_NOT_FOUND': 'User not found.',
    'REQUEST_FAIL': 'Request fail.',
    'FILE_UPLOAD_ERROR': 'File could not be uploaded.',
    'FILE_NOT_BUFFER': 'Only buffer is allowed.',
    'FILE_TYPE_ERROR': 'File type not supported.',
    'FILE_SIZE_EXCEED': 'File size too large.',
    'SOMETHING_WRONG': "Oops! something went wrong."
};

//const SWAGGER_DEFAULT_RESPONSE_MESSAGES = [
//    {code: CONSTANTS.STATUS_CODE.OK, message: 'OK'},
//    {code: CONSTANTS.STATUS_CODE.CREATED, message: 'Created'},
//    {code: CONSTANTS.STATUS_CODE.BAD_REQUEST, message: 'Bad Request'},
//    {code: CONSTANTS.STATUS_CODE.UNAUTHORIZED, message: 'Unauthorized'},
//    {code: CONSTANTS.STATUS_CODE.NOT_FOUND, message: 'Not Found'},
//    {code: CONSTANTS.STATUS_CODE.ALREADY_EXISTS_CONFLICT, message: 'Already Exists'},
//    {code: CONSTANTS.STATUS_CODE.SERVER_ERROR, message: 'Internal Server Error'}
//];

//module.exports.SWAGGER_DEFAULT_RESPONSE_MESSAGES = SWAGGER_DEFAULT_RESPONSE_MESSAGES;
module.exports.ERROR_MESSAGES = ERROR_MESSAGES;
module.exports.SOCKET_DEFAULT_MESSAGES = SOCKET_DEFAULT_MESSAGES;
module.exports.SUCCESS_MESSAGES = SUCCESS_MESSAGES;