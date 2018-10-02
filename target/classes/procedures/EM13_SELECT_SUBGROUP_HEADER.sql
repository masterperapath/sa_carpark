CREATE OR REPLACE FUNCTION audit.em13_select_subgroup_header(pi_groupname character varying, pi_mid character varying, pi_group_id character varying, pi_username character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
declare
  v_sql                       VARCHAR(32000);
  po_cursor                   REFCURSOR;
BEGIN
	 v_sql := '
		WITH params_table AS (
      		SELECT $1 AS group_name,	
             	   $2 AS mid,
				   $3 AS group_id,
				   $4 AS user_name
    		)
		SELECT grp.c_group_name, usr.c_username, usr.i_subgrp_id, usr.i_group_id, LPAD(usr.i_group_id::VARCHAR, 7, ''0'') AS groupidLPAD
		FROM user_profile usr 
			JOIN group_profile grp ON grp.i_group_id = usr.i_group_id
		    left JOIN subgrp_mid_relate sub ON sub.i_subgrp_id = usr.i_subgrp_id
			JOIN params_table prm ON 1 = 1 
		WHERE usr.i_subgrp_id != 0
	';
	
  IF pi_groupname IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(grp.c_group_name)' || ' LIKE ''%'' || LOWER(prm.group_name) || ''%''';
  END IF;

  IF pi_mid IS NOT NULL THEN
    v_sql := v_sql || 'AND sub.i_mid_id = '||pi_mid::numeric||'';
  END IF;
  
  IF pi_group_id IS NOT NULL THEN
    v_sql := v_sql || 'AND grp.i_group_id = '||pi_group_id::NUMERIC ||'';
  END IF;
  
  IF pi_username IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(usr.c_username)' || ' LIKE ''%'' || LOWER(prm.user_name) || ''%''';
  END IF;
  
  v_sql := v_sql || '
         GROUP BY usr.c_username, grp.c_group_name, usr.i_subgrp_id, usr.i_group_id
      ';
	 
    OPEN po_cursor FOR EXECUTE v_sql
    		using pi_groupname,
    			  pi_mid,
    			  pi_group_id,
    			  pi_username;
  RETURN po_cursor;
END
$function$
