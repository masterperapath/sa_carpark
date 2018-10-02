CREATE OR REPLACE FUNCTION audit.em12_select_user(pi_group_name character varying, pi_user_name character varying, pi_group_id character varying, pi_mid character varying)
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
             $2 AS user_name,
			 $3 AS group_id,
			 $4 AS mid
    )
     SELECT pro.c_username, grp.c_group_name, pro.i_user_id, pro.i_group_id, LPAD(pro.i_group_id::VARCHAR, 7, ''0'') AS groupid, 
     CASE
    	WHEN pro.i_subgrp_id = 0 THEN ''กลุ่มหลัก''
   	    ELSE ''กลุ่มย่อย''
	end i_subgrp_id
	  FROM user_profile pro
	    JOIN group_profile grp ON (pro.i_group_id = grp.i_group_id)
	    LEFT JOIN box_profile box ON (box.i_user_id = pro.i_user_id)
        JOIN params_table prm ON (1 = 1)
	WHERE 1=1
  ';

  IF pi_group_name IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(grp.c_group_name)' || ' LIKE ''%'' || LOWER(prm.group_name) || ''%''';
  END IF;

  IF pi_user_name IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(pro.c_username)' || ' LIKE ''%'' || LOWER(prm.user_name) || ''%''';
  END IF;

  IF pi_group_id IS NOT NULL THEN
    v_sql := v_sql || 'AND grp.i_group_id = '||pi_group_id::NUMERIC||'';
  END IF;
  
  IF pi_mid IS NOT NULL THEN
    v_sql := v_sql || 'AND box.i_mid_id = '||pi_mid::NUMERIC||'';
  END IF;
  
  v_sql := v_sql || '
           GROUP BY pro.c_username, grp.c_group_name, pro.i_user_id, pro.i_subgrp_id, grp.i_group_id;
      ';
  OPEN po_cursor FOR EXECUTE v_sql
        USING pi_group_name
            , pi_user_name
            , pi_group_id
            , pi_mid;
            
  RETURN po_cursor;
END
$function$
