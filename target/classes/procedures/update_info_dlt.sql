CREATE OR REPLACE FUNCTION audit.update_info_dlt(pi_mid character varying, pi_plate_number character varying, pi_province character varying, pi_car_brand character varying, pi_car_weight character varying, pi_vin character varying, pi_owner_name character varying, pi_regis_type character varying, pi_car_seat character varying, pi_truck_shaft character varying, pi_truck_wheel character varying, pi_truck_tyre character varying, pi_user_plate_number character varying, pi_user_vin character varying, pi_dt_printed character varying, pi_dt_install character varying, pi_model character varying, pi_card_reader boolean)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_get_rowcount     		  NUMERIC;
BEGIN
	
	UPDATE box_profile
        SET dt_install_for_dlt = pi_dt_install::TIMESTAMP
    WHERE i_mid_id = pi_mid::NUMERIC;
 
     UPDATE      dlt_regis_info
        SET         c_plate_number = pi_plate_number, c_car_brand = pi_car_brand , c_vin = pi_vin ,
                    i_regis_type = pi_regis_type::NUMERIC , b_card_reader = pi_card_reader, i_province_code = pi_province::NUMERIC ,
                    i_car_seat = pi_car_seat::NUMERIC , i_truck_shaft = pi_truck_shaft::NUMERIC , i_truck_wheel = pi_truck_wheel::NUMERIC , 
                    i_truck_tyre = pi_truck_tyre::NUMERIC , d_car_weight = pi_car_weight::NUMERIC , c_owner_name = pi_owner_name ,
                    c_user_plate_number = pi_user_plate_number , c_user_vin = pi_user_vin ,
                    dt_printed = pi_dt_printed::TIMESTAMP , c_model = pi_model
        WHERE       i_mid_id = pi_mid::NUMERIC;
 
       GET DIAGNOSTICS v_get_rowcount = ROW_COUNT;
 
 IF v_get_rowcount = 0 then 
     UPDATE box_profile
        SET dt_install_for_dlt = pi_dt_install::TIMESTAMP
    WHERE i_mid_id = pi_mid::NUMERIC;
    
     INSERT INTO dlt_regis_info  ( i_mid_id , c_plate_number , c_car_brand , c_vin , 
                                      i_regis_type , b_card_reader , i_province_code ,
                                      i_car_seat , i_truck_shaft , i_truck_wheel , i_truck_tyre ,
                                      d_car_weight , c_owner_name , c_user_plate_number , c_user_vin , c_model, dt_printed )
        VALUES                      ( pi_mid::NUMERIC , pi_plate_number, pi_car_brand , pi_vin , 
                                      pi_regis_type::NUMERIC , pi_card_reader , pi_province::NUMERIC,
                                      pi_car_seat::NUMERIC , pi_truck_shaft::NUMERIC , pi_truck_wheel::NUMERIC , pi_truck_tyre::NUMERIC ,
                                      pi_car_weight::NUMERIC , pi_owner_name, pi_user_plate_number , pi_user_vin, pi_model, pi_dt_printed::TIMESTAMP );
  END IF;  

  RETURN audit.select_info_dlt(pi_mid); 
 
END  
$function$
