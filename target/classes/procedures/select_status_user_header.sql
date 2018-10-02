CREATE OR REPLACE FUNCTION audit.select_status_user_header(pi_groupid character varying, pi_groupname character varying, pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$     
DECLARE
  po_cursor                   REFCURSOR;
  v_sql						  VARCHAR(32000);
BEGIN
   v_sql := '
 		WITH params_table AS (
      SELECT $1 AS pigroupid,
             $2 AS pigroupname,
			 $3 AS pimid
   		 )
		SELECT  usr.b_overdue_fees, box.i_mid_id, usr.i_user_id, usr.i_group_id , usr.enabled , usr.b_show_msg2user
		FROM public.box_profile box
    	LEFT OUTER JOIN  public.user_profile usr  ON usr.i_user_id = box.i_user_id 
        right OUTER JOIN public.group_profile grp ON grp.i_group_id = box.i_group_id
  	    JOIN params_table prm ON (1 = 1)
  	    WHERE box.i_mid_id <= 888000';

  	    IF pi_groupid IS NOT NULL THEN 
			 v_sql := v_sql || ' AND grp.i_group_id = '|| pi_groupid::NUMERIC ||'';
		END IF;
		
  	    
    	IF pi_groupname IS NOT NULL THEN 
    		 v_sql := v_sql || ' AND LOWER(grp.c_group_name)' || ' LIKE ''%'' || LOWER(prm.pigroupname) || ''%''';
        END IF; 
    		 

    	IF pi_mid IS NOT NULL THEN 
    		 v_sql := v_sql || ' AND box.i_mid_id = '|| pi_mid::NUMERIC ||'';
    	END IF;
    	
    	 v_sql := v_sql || '
           GROUP BY  usr.b_overdue_fees, box.i_mid_id, usr.i_user_id, usr.i_group_id , usr.enabled;
           ';
    	
  OPEN po_cursor FOR EXECUTE v_sql
        USING pi_groupid
            , pi_groupname
            , pi_mid;
            
  RETURN po_cursor;
END
$function$
