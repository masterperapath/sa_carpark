CREATE OR REPLACE FUNCTION audit.select_eyemin_status(pi_group_name character varying, pi_plate_number character varying, pi_car_code character varying, pi_car_type character varying, pi_mid character varying, pi_uservin character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_sql                       VARCHAR(32000);
  po_cursor                   REFCURSOR;
BEGIN
  v_sql := '
    WITH params_table AS (
      SELECT $1 AS group_name,
             $2 AS plate_number,
             $3 AS car_code,
             $4 AS car_type,
             $5 AS mid,
             $6 AS uservin
    )

    SELECT eyemin.i_mid_id, eyemin.c_plate_number, eyemin.c_car_code, eyemin.ts_acc_on, eyemin.ts_acc_off, eyemin.ts_power_cut, eyemin.ts_no_satellite
    FROM (
      SELECT  
        COALESCE(live.i_mid_id :: VARCHAR, ''-'')AS i_mid_id,
        box.c_plate_number AS c_plate_number,
        box.c_car_code AS c_car_code,
        COALESCE(TO_CHAR(live.ts_acc_on, ''DD/MM/YYYY HH24:MI''), ''-'') AS ts_acc_on,
        COALESCE(TO_CHAR(live.ts_acc_off, ''DD/MM/YYYY HH24:MI''), ''-'') AS ts_acc_off,
        COALESCE(TO_CHAR(live.ts_power_cut, ''DD/MM/YYYY HH24:MI''), ''-'') AS ts_power_cut,
        COALESCE(TO_CHAR(live.ts_no_satellite, ''DD/MM/YYYY HH24:MI''), ''-'') AS ts_no_satellite
      FROM public.box_profile  box
		    LEFT JOIN livedata live ON live.i_mid_id= box.i_mid_id
            LEFT JOIN group_profile grp ON grp.i_group_id = box.i_group_id
            LEFT JOIN public.dlt_regis_info dlt ON dlt.i_mid_id = box.i_mid_id
        JOIN params_table prm ON 1 = 1
      WHERE box.i_mid_id <= 888000 

  ';

  IF pi_group_name IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(grp.c_group_name)' || ' LIKE ''%'' || LOWER(prm.group_name) || ''%''';
  END IF;

  IF pi_plate_number IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(box.c_plate_number)' || ' LIKE ''%'' || LOWER(prm.plate_number) || ''%''';
  END IF;

  IF pi_car_code IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(box.c_car_code)' || ' LIKE ''%'' || LOWER(prm.car_code) || ''%''';
  END IF;

  IF pi_car_type IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(box.c_car_type)' || ' LIKE ''%'' || LOWER(prm.car_type) || ''%''';
  END IF;

  IF pi_mid IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'box.i_mid_id::VARCHAR' || ' LIKE ''%'' || prm.mid || ''%'' ';
  END IF;

  IF pi_uservin IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(box.c_vin)' || ' LIKE ''%'' || LOWER(prm.uservin) || ''%''';
  END IF;

  v_sql := v_sql || '
           ORDER BY live.i_mid_id
      ';
      
  IF pi_group_name IS NULL AND pi_plate_number IS NULL AND pi_car_code IS NULL AND pi_car_code IS NULL AND pi_mid IS NULL AND pi_uservin IS NULL THEN
    v_sql := v_sql || ' LIMIT 100 ';
  END IF;

  v_sql := v_sql || '
        )eyemin
      ';

  OPEN po_cursor FOR EXECUTE v_sql
        USING pi_group_name
            , pi_plate_number
            , pi_car_code
            , pi_car_type
            , pi_mid
            , pi_uservin;
            
  RETURN po_cursor;
END
$function$
