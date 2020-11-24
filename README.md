OTT Project :

User : 

SignUp :
 
	 Params (post)
		params 1 : EmialID 
		params 2 : MobileNumber 
		params 3 : Password
		params 4 : device_id
		
	Responce :
			status:successfully
			message : Register successfully
			

Send OTP : 

     Params (post)
		params 1 : MobileNumber
		params 2 : Device id 
		params 3 : token
	

	 Responce :
			status:successfully
			message : OTP successfully
			
			
Otp verfication :
 
	 Params (post)
		params 1 : mobilenumber 
		params 2 : Otp 
		params 5 : device_id
		params 6 : token
		
	Responce :
			status:successfully
			message : Otp verfiy successfully
			userdetails:
			{
			userId : 1
			user type : 0
			userimage : https//userimage
			username : prabhu
			mobilenumber:7200419484
			email:123@gmail.com
			password:123456
			otp_verification:0
			Otp:123456
			device_id:123456464
			token:dasdasdfasfa613
			subscribe_valid_date : dd / mm / yyyy
			subscribe_valid_days : 365
			Share_status : 0
			}	
	
	


Login :
 
	Params (post)
		params 1 : username 
		params 2 : password 
		params 3 : device_id
		params 4 : token
		
	Responce :
			status:successfully
			message : Login successfully
			userdetails:
			{
			userId : 1
			user type : 0
			userimage : https//userimage
			username : prabhu
			mobilenumber:7200419484
			email:123@gmail.com
			password:123456
			otp_verification:0
			Otp:123456
			device_id:123456464
			token:dasdasdfasfa613
			Share_status : 0
			}
			
Home Screen :			
			
	1.banner image
	2.Home category 
	3.movie category 
	4.Upcoming category 
	5.profile
		a.updateProfile
		b.watchedmovie
		c.Resetpassword
		
	
  1.Banner image : (get)
	data: (array)
		banner id 
		banner name
		banner image
		banner deatails
		banner description
		banner create date
		banner valid date
		banner valid days
			
   2,3,4,5.Home category, movie category  , Upcoming category , watchedmovie
  
	Params (post)
	  params 1 : user_id 
	  params 2 : device_id
	  params 3 : token 
	  params 4 : type (movie category  , Upcoming category , watchedmovie)
	
	data : 
		movie_id:1
		movie_name:endhiran
		movie_topic:action
		movie_description:it is an rajini movie
		movie_rate:10Rs
		movie_gst:10Rs
		movie_plan: gold / silver / platinum
		movie_timing : 2hrs
		movie_year  :2019


		movie_adult:18+
		movie_available_in:tamil/english / telugu
		movie_type:serious / movie / short film
		movie_language:tamil
		movie_trailer_available:0 / 1 
		movie_trailer:https//youtube_link
		movie_release_date:dd/mm/yyyy
		movie_upload_date:dd/mm/yyyy
		//movie_valid_date:dd/mm/yyyy
		//movie_valid_days:5
		//movie_viewed: 0 / 1
		//movie_buy_status:0 / 1 
		//movie_buy_date: dd / mm / yyyy
		movie_copyright_txt:@copyrighton102020
		movie_banner_image : https//userimage
		movie_banner_sub_image_1 : https//userimage
		movie_banner_sub_image_2 : https//userimage
	    movie_banner_sub_image_3 : https//userimage
		movie_banner_sub_image_4 : https//userimage
		movie_actress_images: (array)
				actor_image_id:1
				actor_name:rajini
				actor_image:http://actorimage
		
 
			
Subcribe : 

	Params (post)
		params 1 : user_id 
		params 2 : mobilenumber 
		params 3 : subscribe_by_method(paymentgate)
		params 4 : subscribe_by_plan(gold / silver / platinam)
		params 5 : subscribe_date
		params 6 : subscribe_amount
		params 7 : device_id
		params 8 : token
		params 9 : movieId
			
	Responce :
			status:successfully
			message : Subcribe applied successfully
			Subcribe:
			{
			subscribe_Id : 1
			subscribe_plan : (gold / silver / platinam)
			subscribe_method : (paymentgate)
			subscribe_amount : 900
			subscribe_date : dd / mm / yyyy
			subscribe_valid_date :  dd / mm / yyyy
			subscribe_valid_days : 365
			}	
			
WatchNow:
	Params (get)
		params 1 : user_id 
		params 2 : device_id
		params 3 : token	
		params 4 : movieId		
			
	Responce :		
		subscribe_status: 0 / 1 
		subscribe_Id : 1
		subscribe_plan : (gold / silver / platinam)
		subscribe_method : (paymentgate)
		subscribe_amount : 900
		subscribe_date : dd / mm / yyyy
		subscribe_valid_date :  dd / mm / yyyy
		subscribe_valid_days : 365
			
			
			
view profile : (get)

		userdata:
			userId : 1
			user type : 0
			userimage : https//userimage
			username : prabhu
			mobilenumber:7200419484
			email:123@gmail.com
			password:123456
			otp_verification:0
			Otp:123456
			device_id:123456464
			token:dasdasdfasfa613
			subscribe_valid_date : dd / mm / yyyy
			subscribe_valid_days : 365
			Share_status : 0
			
			
Update Profile : 

	Params (post)
		params 1 : user_id 
		params 2 : device_id
		params 3 : userimage
		params 4 : username
		params 5 : mobilenumber
		params 6 : email_id
		params 7 : password
		params 8 : location
		params 3 : token
		
		
	Responce :
			status:successfully
			message : Login successfully
			userdetails:
			{
			userId : 1
			user type : 0
			userimage : https//userimage
			username : prabhu
			mobilenumber:7200419484
			email:123@gmail.com
			password:123456
			otp_verification:0
			Otp:123456
			device_id:123456464
			token:dasdasdfasfa613
			subscribe_valid_date : dd / mm / yyyy
			subscribe_valid_days : 365
			Share_status : 0
			}		
			
Change Password & forget Password :  	


	Notes : 1. if i send the changePassword you should be check the old password  
			2. if i send the forgetPassword you should NOT check the old password  
			
	Params (post)
		params 1 : user_id 
		params 2 : device_id
		params 3 : mobilenumber
		params 4 : old password
		params 5 : new password
		params 6 : confirm password
		params 7 : type (changePassword / forgetPassword)
		params 8 : token		
			
	Responce :
			status:successfully
			message : Password Updated  successfully	
			
			
			
			
			
			
			
			
	 
