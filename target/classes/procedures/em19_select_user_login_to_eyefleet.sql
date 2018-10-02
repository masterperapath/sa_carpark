CREATE OR REPLACE FUNCTION audit.em19_select_user_login_to_eyefleet(pi_group_id character varying, pi_groupname character varying, pi_username character varying, pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
  v_sql						  VARCHAR(32000);
BEGIN
  v_sql := '
    WITH params_table AS (
      SELECT $1 AS pi_group_id,
             $2 AS pi_groupname,
			       $3 AS pi_username,
			       $4 AS pi_mid
    )
  SELECT  		LPAD(grp.i_group_id::VARCHAR, 7, ''0'') AS i_group_id,
    	   		usr.i_user_id,
    	   		grp.c_group_name,
				usr.c_username
	FROM  public.user_profile usr
    LEFT JOIN  public.group_profile grp ON usr.i_group_id = grp.i_group_id
    LEFT JOIN  public.box_profile box ON box.i_user_id = usr.i_user_id
		JOIN params_table prm ON (1 = 1)
  WHERE usr.i_subgrp_id = 0';

  IF  pi_mid IS NOT NULL THEN
    v_sql := v_sql || ' AND box.i_mid_id = ' || pi_mid ::NUMERIC || '';
  END IF;

  IF pi_group_id IS NOT NULL THEN
    v_sql := v_sql || ' AND grp.i_group_id = ' || pi_group_id :: NUMERIC || '';
  END IF;

  IF pi_username IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(usr.c_username)' || ' LIKE ''%'' || LOWER(prm.pi_username) || ''%''';
  END IF;

  IF pi_groupname IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(grp.c_group_name)' || ' LIKE ''%'' || LOWER(prm.pi_groupname) || ''%''';
  END IF;

  v_sql := v_sql || ' GROUP BY grp.i_group_id, box.i_user_id, grp.c_group_name, usr.c_username,usr.i_user_id ';

  OPEN po_cursor FOR EXECUTE v_sql
  USING pi_group_id
  , pi_groupname
  , pi_username
  , pi_mid;
  RETURN po_cursor;
END
$function$
