CREATE OR REPLACE FUNCTION audit.monitor_livedata_history_eyemin(pi_mid character varying, pi_start_date character varying, pi_end_date character varying, pi_mid_2_digit character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_sql                       VARCHAR(32000);
  po_cursor                   REFCURSOR;
BEGIN
  v_sql := '
    SELECT eyemin.i_mid_id, eyemin.status1, eyemin.status2, eyemin.status3 ,COALESCE(TO_CHAR(eyemin.ts_gprsdate, ''DD/MM/YYYY HH24:MI:SS''),''-'')  AS ts_gprsdate
	 	 , COALESCE(TO_CHAR(eyemin.ts_gpsdate, ''DD/MM/YYYY HH24:MI:SS''),''-'')  AS ts_gpsdate, eyemin.position, eyemin.i_speed, eyemin.c_car_code, eyemin.c_plate_number
    	 , b_ip2_acc, b_ip1_door
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
				CASE
				WHEN ts_ext_power_on < ts_power_cut
					THEN (
						CASE
						WHEN ((i_ext_power_voltage < 900) AND (EXTRACT(DAY FROM (history.ts_gpsdate - ts_power_cut)) < 3))
							THEN ''ไฟ''
						ELSE ''''
						END
					)
				ELSE (
					CASE i_word_ip2
					WHEN 0
						THEN (
							CASE WHEN history.b_ip5_input
								THEN ''test mode''
							WHEN history.b_ip4_shock
								THEN ''test mode''
							WHEN history.b_ip3
								THEN ''test mode''
							WHEN history.b_ip2_acc
								THEN ''test mode''
							WHEN history.b_ip1_door
								THEN ''test mode''
							ELSE ''''
							END
						)
					WHEN 1
						THEN (CASE WHEN history.b_ip1_door
							THEN ''เปิด''
									ELSE ''-'' END)
					WHEN 2
						THEN (CASE WHEN history.b_ip1_door
							THEN ''มีคน''
									ELSE ''ว่าง'' END)
					WHEN 3
						THEN (CASE WHEN history.b_ip2_acc
							THEN (CASE WHEN history.b_ip1_door
								THEN ''ว่าง''
										ELSE ''มีคน'' END)
									ELSE ''ว่าง'' END)
					WHEN 4
						THEN (CASE WHEN history.b_ip1_door
							THEN ''เสีย''
									WHEN history.b_ip4_shock
										THEN ''พัก''
									WHEN history.b_ip3
										THEN ''รอ''
									ELSE ''-''
									END)
					WHEN 5
						THEN (CASE WHEN history.b_ip5_input
							THEN ''-''
									ELSE ''เปิด'' END)
					WHEN 6
						THEN (CASE WHEN history.b_ip5_input
							THEN ''เปิด''
									ELSE ''-'' END)
					WHEN 7
						THEN (CASE WHEN history.b_ip1_door
							THEN ''เสีย''
									WHEN history.b_ip4_shock
										THEN ''รอ''
									WHEN history.b_ip3
										THEN ''พัก''
									ELSE ''-''
									END)
					WHEN 8
						THEN (CASE WHEN history.b_ip1_door
							THEN ''-''
									ELSE ''เปิด'' END)
					WHEN 9
						THEN (CASE WHEN history.b_ip4_shock
							THEN ''-''
									ELSE ''เปิด'' END)
					WHEN 10
						THEN (CASE WHEN history.b_ip4_shock
							THEN ''เปิด''
									ELSE ''-'' END)
					WHEN 11 THEN(CASE WHEN NOT history.b_ip2_acc AND history.i_speed >= 10 THEN ''กุญแจ'' ELSE (CASE WHEN history.b_ip1_door THEN ''เปิด'' ELSE ''-'' END)END)
					ELSE ''''
					END)
				END                                            AS status2,
				CASE
				WHEN ts_ext_power_on < ts_power_cut
					THEN (
						CASE
						WHEN ((i_ext_power_voltage < 900) AND (EXTRACT(DAY FROM (history.ts_gpsdate - ts_power_cut)) < 3))
							THEN ''ไฟ''
						ELSE ''''
						END
					)
				ELSE (
					CASE i_word2_ip2
					WHEN 0
						THEN (
							CASE WHEN history.b_ip5_input
								THEN ''test mode''
							WHEN history.b_ip4_shock
								THEN ''test mode''
							WHEN history.b_ip3
								THEN ''test mode''
							WHEN history.b_ip2_acc
								THEN ''test mode''
							WHEN history.b_ip1_door
								THEN ''test mode''
							ELSE ''''
							END
						)
					WHEN 1
						THEN (CASE WHEN history.b_ip1_door
							THEN ''เปิด''
									ELSE ''-'' END)
					WHEN 2
						THEN (CASE WHEN history.b_ip1_door
							THEN ''มีคน''
									ELSE ''ว่าง'' END)
					WHEN 3
						THEN (CASE WHEN history.b_ip2_acc
							THEN (CASE WHEN history.b_ip1_door
								THEN ''ว่าง''
										ELSE ''มีคน'' END)
									ELSE ''ว่าง'' END)
					WHEN 4
						THEN (CASE WHEN history.b_ip1_door
							THEN ''เสีย''
									WHEN history.b_ip4_shock
										THEN ''พัก''
									WHEN history.b_ip3
										THEN ''รอ''
									ELSE ''-''
									END)
					WHEN 5
						THEN (CASE WHEN history.b_ip5_input
							THEN ''-''
									ELSE ''เปิด'' END)
					WHEN 6
						THEN (CASE WHEN history.b_ip5_input
							THEN ''เปิด''
									ELSE ''-'' END)
					WHEN 7
						THEN (CASE WHEN history.b_ip1_door
							THEN ''เสีย''
									WHEN history.b_ip4_shock
										THEN ''รอ''
									WHEN history.b_ip3
										THEN ''พัก''
									ELSE ''-''
									END)
					WHEN 8
						THEN (CASE WHEN history.b_ip1_door
							THEN ''-''
									ELSE ''เปิด'' END)
					WHEN 9
						THEN (CASE WHEN history.b_ip4_shock
							THEN ''-''
									ELSE ''เปิด'' END)
					WHEN 10
						THEN (CASE WHEN history.b_ip4_shock
							THEN ''เปิด''
									ELSE ''-'' END)
					ELSE ''''
					END)
				END                                            AS status3,
				history.ts_gprsdate AS ts_gprsdate ,
				history.ts_gpsdate +''7 hour''::INTERVAL AS ts_gpsdate ,
				CONCAT(tum.tambon_t, '' '', amp.amphur_t, '' '', pro.province_t, '' ( '',
							 ROUND(history.i_latitude / 1000000.0 :: NUMERIC, 6), '','', ROUND(history.i_longitude / 1000000.0 :: NUMERIC, 6),
							 '' )'')                                   AS position,
				COALESCE(history.i_speed::VARCHAR,''-'') AS i_speed,
        			box.c_car_code AS c_car_code,
				box.c_plate_number AS c_plate_number,
				CASE WHEN history.b_ip2_acc THEN ''เปิด'' ELSE ''ปิด'' END AS b_ip2_acc,
				CASE WHEN history.b_ip1_door THEN ''เปิด'' ELSE ''ปิด'' END AS b_ip1_door
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
	    ORDER BY eyemin.ts_gpsdate ASC
  ';

  OPEN po_cursor FOR EXECUTE v_sql;
  RETURN po_cursor;
END
$function$
