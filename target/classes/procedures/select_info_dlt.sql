CREATE OR REPLACE FUNCTION audit.select_info_dlt(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN

    OPEN po_cursor FOR 
			SELECT   b.i_mid_id , d.c_plate_number , d.c_car_brand , d.c_vin , COALESCE(d.c_model,'0480000') AS c_model,
            COALESCE(t.i_regis_type, 0) AS i_regis_type , t.c_regis_type_name ,
            COALESCE(d.b_card_reader, false) AS b_card_reader , 
            COALESCE(p.i_province_code, 0) AS i_province_code , b.c_car_code , p.c_province_name ,
            COALESCE(i_car_seat,'0') AS i_car_seat , COALESCE(i_truck_shaft,'0') AS i_truck_shaft , 
            COALESCE(i_truck_wheel,'0') AS i_truck_wheel , COALESCE(i_truck_tyre,'0') AS i_truck_tyre , 
            COALESCE(d_car_weight,'0.00') AS d_car_weight , d.c_owner_name , 
            COALESCE(TO_CHAR(b.dt_install_for_dlt, 'DD-MM-YYYY'), '') AS dt_install_for_dlt,
	        COALESCE(d.i_cert_number, 0) AS i_cert_number , d.c_user_plate_number ,
	        d.c_user_vin, d.i_updated,
	        COALESCE(TO_CHAR(d.dt_printed, 'DD-MM-YYYY'), '') AS dt_printed
        FROM        dlt_regis_info d
        RIGHT OUTER JOIN    box_profile b           ON  d.i_mid_id = b.i_mid_id
        LEFT OUTER JOIN     dlt_sys_regis_type t    ON  d.i_regis_type = t.i_regis_type
        LEFT OUTER JOIN     dlt_sys_province_code p ON  d.i_province_code = p.i_province_code
        WHERE       b.i_mid_id = pi_mid :: NUMERIC;

  RETURN po_cursor;
END
$function$
