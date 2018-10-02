CREATE OR REPLACE FUNCTION audit.em27_select_summary_report(pi_mid character varying, pi_start_date character varying, pi_end_date character varying, pi_mid_2_digit character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_sql                       VARCHAR(32000);
  po_cursor                   REFCURSOR;
BEGIN
  v_sql := '
    SELECT (ROW_NUMBER() OVER(ORDER BY eyemin.ts_gprsdate ASC))::INT AS No_, eyemin.i_mid_id, eyemin.c_car_code, eyemin.c_plate_number, eyemin.status1, eyemin.position
			, COALESCE(TO_CHAR(eyemin.ts_gprsdate, ''DD/MM/YYYY HH24:MI:SS''),''-'')  AS ts_gprsdate
	 	 	, COALESCE(TO_CHAR(eyemin.ts_gpsdate, ''DD/MM/YYYY HH24:MI:SS''),''-'')  AS ts_gpsdate
    FROM (
			SELECT
				box.i_mid_id,
				CASE
				WHEN history.c_gps_valid = ''L'' OR history.c_gps_valid = ''V'' OR history.i_speed > 200
					THEN 7
				WHEN history.i_speed <= 2 AND history.b_ip2_acc IS TRUE
					THEN 1
				WHEN history.i_speed <= box.i_speed_limit AND history.b_ip2_acc IS TRUE
					THEN 2
				WHEN history.i_speed > box.i_speed_limit AND history.b_ip2_acc IS TRUE
					THEN 3
				WHEN history.i_speed <= 9999 AND history.b_ip2_acc IS FALSE
					THEN 4
				ELSE 0
				END                                            AS status1,
				history.ts_gprsdate AS ts_gprsdate ,
				history.ts_gpsdate +''7 hour''::INTERVAL AS ts_gpsdate ,
				CONCAT(tum.tambon_t, '' '', amp.amphur_t, '' '', pro.province_t, '' ( '',
							 ROUND(history.i_latitude / 1000000.0 :: NUMERIC, 6), '','', ROUND(history.i_longitude / 1000000.0 :: NUMERIC, 6),
							 '' )'')                                   AS position,
        		box.c_car_code AS c_car_code,
				CASE 
                WHEN box.c_plate_number = ''-''
                     THEN box.c_car_code
                ELSE box.c_plate_number
             	END AS c_plate_number 
			FROM  (
					 SELECT *
					 FROM historydata4_'|| pi_mid_2_digit ||
					 ' WHERE i_mid_id = '|| pi_mid ||
					 ' 	AND '''|| pi_start_date || ''' '||'::timestamp - ''7 hour''::interval <= ts_gpsdate
        			 	AND ts_gpsdate <= '''|| pi_end_date || ''' '||'::timestamp - ''7 hour''::interval
                     	AND '''|| pi_start_date || ''' '||'::timestamp - ''7 hour''::interval  <= ts_gprsdate
        				AND ts_gprsdate <= '''|| pi_end_date || ''' '||'::timestamp + ''168 hour''::interval
           		)history
				LEFT JOIN public.box_profile box ON box.i_mid_id = history.i_mid_id
				LEFT JOIN public.livedata live ON live.i_mid_id = history.i_mid_id
				LEFT JOIN public.config_receiver con ON con.i_mid_id = history.i_mid_id
				LEFT JOIN public.tumbon tum ON tum.gid = history.i_tambon
				LEFT JOIN public.amphur amp ON amp.gid = history.i_amphur
				LEFT JOIN public.province pro ON pro.gid = history.i_province
      WHERE box.i_mid_id <= 888000
        ) eyemin
	    ORDER BY eyemin.ts_gprsdate ASC
  ';

  OPEN po_cursor FOR EXECUTE v_sql;
  RETURN po_cursor;
END
$function$
