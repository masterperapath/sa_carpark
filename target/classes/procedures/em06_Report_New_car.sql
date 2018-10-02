CREATE OR REPLACE FUNCTION audit.em06_Report_New_car(pi_mid_id NUMERIC)
RETURNS SETOF audit.reportform_type_table
AS $$
DECLARE
	sub_i_regis_type_1 	  VARCHAR := '0';
	sub_i_regis_type_2    VARCHAR := '0';
	sub_i_regis_type_3    VARCHAR := '0';
	sub_i_regis_type_4	  VARCHAR := '0';
	length_i_regis_type   VARCHAR := '0';
BEGIN
	SELECT SUBSTR(t.i_regis_type::VARCHAR,1,1) , SUBSTR(t.i_regis_type::VARCHAR,2,1), SUBSTR(t.i_regis_type::VARCHAR,3,1)
    	   , SUBSTR(t.i_regis_type::VARCHAR,4,1), OCTET_LENGTH(t.i_regis_type::VARCHAR)
	INTO sub_i_regis_type_1, sub_i_regis_type_2, sub_i_regis_type_3, sub_i_regis_type_4, length_i_regis_type
	FROM        dlt_regis_info d
    RIGHT OUTER JOIN    box_profile b           ON  d.i_mid_id = b.i_mid_id
    LEFT OUTER JOIN     dlt_sys_regis_type t    ON  d.i_regis_type = t.i_regis_type
    LEFT OUTER JOIN     dlt_sys_province_code p ON  d.i_province_code = p.i_province_code
    WHERE       b.i_mid_id = pi_mid_id::NUMERIC;

	-- Create temp table temp_reportform
   	PERFORM  audit.report_create_temp_reportform();
   	
   	INSERT INTO temp_reportform(char1, char2, char3, char4, date1, char5, char6, char7, char8, date2, num1, num2, num3, char9, char10, char11)
  	SELECT        LPAD (b.i_mid_id::varchar, 6, '0') AS i_mid_id , d.c_car_brand
                , p.c_province_name ,COALESCE(d.c_owner_name,'-') AS c_owner_name 
                , b.dt_install_for_dlt 
                , CASE WHEN d.c_user_plate_number is null THEN 'จดป้ายทะเบียนใหม่'
                       WHEN d.c_user_plate_number like '' THEN 'จดป้ายทะเบียนใหม่'
                       ELSE d.c_user_plate_number
                       END AS c_user_plate_number, d.c_model 
                , LPAD(d.i_cert_number::varchar, 6, '0') AS i_cert_number , d.c_user_vin , d.dt_printed
                , CASE WHEN d.i_truck_shaft = -1 THEN NULL
                	   ELSE COALESCE(i_truck_shaft,'0') 
                	   END AS i_truck_shaft
            	, CASE WHEN d.i_truck_wheel = -1 THEN NULL
                	   ELSE COALESCE(i_truck_wheel,'0') 
                	   END AS i_truck_wheel
               	, CASE WHEN d.i_truck_tyre = -1 THEN NULL
                	   ELSE COALESCE(i_truck_tyre,'0') 
                	   END AS i_truck_tyre
               	, CASE WHEN sub_i_regis_type_1::NUMERIC = 1 THEN(
               		CASE WHEN sub_i_regis_type_2::NUMERIC = 1 OR sub_i_regis_type_2::NUMERIC = 2 OR sub_i_regis_type_2::NUMERIC = 3 
               				  OR sub_i_regis_type_2::NUMERIC = 4 OR sub_i_regis_type_2::NUMERIC = 6 OR sub_i_regis_type_2::NUMERIC = 7 THEN( 
               				  CASE WHEN length_i_regis_type::NUMERIC > 1 THEN(
               				  		CASE WHEN sub_i_regis_type_2::NUMERIC = 1 THEN 'X1'
               				  		     WHEN sub_i_regis_type_2::NUMERIC = 2 THEN 'X2'
               				  		     WHEN sub_i_regis_type_2::NUMERIC = 3 THEN 'X3'
               				  		     WHEN sub_i_regis_type_2::NUMERIC = 4 THEN 'X4'
               				  		     WHEN sub_i_regis_type_2::NUMERIC = 6 THEN 'X6'
               				  		     WHEN sub_i_regis_type_2::NUMERIC = 7 THEN 'X7'
               				  		ELSE '' END
               				  	)ELSE '' END
               				  )ELSE '' END
                   )ELSE '' END AS car_type
                 , CASE WHEN length_i_regis_type::NUMERIC > 1 THEN(
                     CASE WHEN sub_i_regis_type_3::NUMERIC = 1 THEN 'X1'
                     	  WHEN sub_i_regis_type_3::NUMERIC = 2 THEN 'X2'
                     	  WHEN sub_i_regis_type_3::NUMERIC = 3 THEN 'X3'
                     	  ELSE '' END
                   )ELSE '' END AS type_car
                 , CASE WHEN sub_i_regis_type_1::NUMERIC = 2 THEN(
                 	 CASE WHEN sub_i_regis_type_2::NUMERIC = 1 OR sub_i_regis_type_2::NUMERIC = 2 OR sub_i_regis_type_2::NUMERIC = 3
                 	           OR sub_i_regis_type_2::NUMERIC = 5 OR sub_i_regis_type_2::NUMERIC = 9 THEN(
                 	           		CASE WHEN sub_i_regis_type_2::NUMERIC = 1 THEN 'X1'
                     	  				 WHEN sub_i_regis_type_2::NUMERIC = 2 THEN 'X2'
                     	  				 WHEN sub_i_regis_type_2::NUMERIC = 3 THEN 'X3'
                     	  				 WHEN sub_i_regis_type_2::NUMERIC = 5 THEN 'X5'
                     	  				 WHEN sub_i_regis_type_2::NUMERIC = 9 THEN 'X9'
                     	  				 ELSE '' END
                 	                 )ELSE '' END
                 	)ELSE '' END AS cargo_type
        FROM        dlt_regis_info d
        RIGHT OUTER JOIN    box_profile b           ON  d.i_mid_id = b.i_mid_id
        LEFT OUTER JOIN     dlt_sys_regis_type t    ON  d.i_regis_type = t.i_regis_type
        LEFT OUTER JOIN     dlt_sys_province_code p ON  d.i_province_code = p.i_province_code
        WHERE       b.i_mid_id = pi_mid_id::NUMERIC;
        
        -- Return Data from TEMP_REPORTFORM
		RETURN QUERY  SELECT * FROM TEMP_REPORTFORM;
END;
$$ LANGUAGE plpgsql
